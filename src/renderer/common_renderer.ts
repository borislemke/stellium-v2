import * as async from 'async'
import { renderFile } from 'ejs'
import { resolve as pathResolve } from 'path'
import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { Globals } from '../globals'
import { ReqKeys } from '../helpers/request_keys'
import { SectionRenderer } from './section_renderer/index'
import { stringToCacheKey } from '../helpers/url_cache'
import { RedisTable } from '../helpers/redis_table'
import { minifyTemplate } from './utils/minify_html'
import { TemplateFunctions } from './section_renderer/template_functions'
import { ComponentsStylesCompiler } from './component_renderer/styles_compiler'
import { autoPrefixCss } from './utils/autoprefix'
import { SettingsKeys } from '../helpers/settings_keys'
import * as Raven from 'raven'
import { extractStelliumDomain } from '../utils/extract_stellium_domain'

const redisClient = createClient()

const getSettingsByKey = (collection: any[]) => (key: string): any => {
  const matching = collection.find(_collection => _collection.key === key)

  return matching && matching.value || null
}

function fakeTemplateRenderer (req: Request, ok: boolean = true): Promise<string> {
  const appLocals = req.app.locals

  const PageObject = appLocals[ReqKeys.CurrentPageObject]

  const renderData = {
    CurrentURL: `${req.protocol}://${req.headers['host']}${req.originalUrl}`,
    BaseDomain: `${req.protocol}://${req.headers['host']}/`,
    SettingsKeys,
    getSettingsByKey: getSettingsByKey(appLocals[ReqKeys.DBSettings]),
    RequestKeys: ReqKeys,
    CurrentLanguage: appLocals[ReqKeys.CurrentLanguage],
    DbCollection: {
      Settings: appLocals[ReqKeys.DBSettings],
      Posts: appLocals[ReqKeys.DBPosts],
      Languages: appLocals[ReqKeys.DBLanguages],
      Pages: appLocals[ReqKeys.DBPages],
      Media: appLocals[ReqKeys.DBMediaFiles]
    },
    PageObject,
    TemplateFunctions: new TemplateFunctions(req)
  }

  return new Promise((resolve, reject) => {
    if (ok) {
      async.map(PageObject.sections, SectionRenderer(renderData, req), (err, resolvedSections) => {
        if (err) {
          Raven.captureException(err)

          return void reject(err)
        }

        if (resolvedSections) {
          const TemplateContent = resolvedSections.map(_section => _section.template).join('\n')

          let SectionStyles = ''

          let SectionScripts = ''

          const unifySections = []

          resolvedSections.forEach(_section => {
            if (!unifySections.includes(_section.templateName)) {
              // Concatenate section styles
              SectionStyles += _section.styles + '\n'

              // Concatenate section scripts
              SectionScripts += _section.scripts + '\n'

              unifySections.push(_section.templateName)
            }
          })

          ComponentsStylesCompiler(req.app.locals[ReqKeys.CurrentTemplatePath], (err, ComponentsStyle) => {
            if (err) {
              Raven.captureException(err)
              // Gracefully ignore scss compilation error but notify user about the issue
              ComponentsStyle = ''
            }

            autoPrefixCss(ComponentsStyle + '\n' + SectionStyles, (ignorableError, CompiledStyles) => {
              renderFile(
                pathResolve(req.app.locals[ReqKeys.CurrentTemplatePath], 'index.ejs'),
                {
                  ...renderData,
                  TemplateContent,
                  CompiledStyles,
                  SectionScripts
                },
                (err, html) => {
                  if (err) {
                    Raven.captureException(err)
                    return reject(err)
                  }
                  resolve(html)
                }
              )
            })
          })
        } else {
          Raven.captureException(new Error('resolved section template is empty'))

          resolve('')
        }
      })
    } else {
      reject(new Error('file not found'))
    }
  })
}

export async function commonRenderer (req: Request, res: Response, next: NextFunction) {
  let renderedTemplate

  try {
    renderedTemplate = await fakeTemplateRenderer(req)
    /**
     * TODO(prod): Temporary cheerio fix
     * @date - 27-08-2017
     * @time - 12:52
     */
    renderedTemplate = renderedTemplate.replace(/=""/g, '')
  } catch (err) {
    return next(err)
  }

  const hostname = extractStelliumDomain(req)

  const urlHash = stringToCacheKey(RedisTable.PageCache, hostname, req.url)

  res.send(renderedTemplate)

  if (!Globals.SkipCache) {
    const minified = minifyTemplate(renderedTemplate, true)

    // Do not rely on the cache write to serve the rendered content
    redisClient.set(urlHash, minified.replace(/=""/g, ''), err => {
      if (err) {
        Raven.captureException(err)
      }
    })
  }
}
