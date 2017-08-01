import * as async from 'async'
import { renderFile } from 'ejs'
import { resolve as pathResolve } from 'path'
import { Request, Response } from 'express'
import { createClient } from 'redis'
import { Globals } from '../globals'
import { RequestKeys } from '../helpers/request_keys'
import { SectionRenderer } from './section_renderer/index'
import { stringToCacheKey } from '../helpers/url_cache'
import { RedisTable } from '../helpers/redis_table'
import { minifyTemplate } from './utils/minify_html'
import { errorPageRenderer } from './error_handler'
import { TemplateFunctions } from './section_renderer/template_functions'
import { ComponentsStylesCompiler } from './component_renderer/styles_compiler'
import { autoPrefixCss } from './utils/autoprefix'
import { RaygunClient } from '../utils/raygun'

const redisPageCacheClient = createClient({db: RedisTable.PageCache})

const getSettingsByKey = (collection: any[]) => (key: string): any => {

  const matching = collection.find(_collection => _collection.key === key)

  return matching && matching.value || null
}

function fakeTemplateRenderer (req: Request, ok: boolean = true): Promise<string> {

  const appLocals = req.app.locals

  const PageObject = appLocals[RequestKeys.CurrentPageObject]

  const renderData = {
    /**
     * TODO(prod): Production value
     * @date - 25-07-2017
     * @time - 21:11
     */
    CurrentURL: 'http://stellium2.dev/',
    /**
     * TODO(prod): Production value
     * @date - 25-07-2017
     * @time - 21:11
     */
    BaseDomain: 'http://stellium2.dev/',
    getSettingsByKey: getSettingsByKey(appLocals[RequestKeys.DBSettings]),
    RequestKeys,
    CurrentLanguage: appLocals[RequestKeys.CurrentLanguage],
    DbCollection: {
      Settings: appLocals[RequestKeys.DBSettings],
      Posts: appLocals[RequestKeys.DBPosts],
      Languages: appLocals[RequestKeys.DBLanguages],
      Pages: appLocals[RequestKeys.DBPages],
      Media: appLocals[RequestKeys.DBMediaFiles]
    },
    PageObject,
    TemplateFunctions: new TemplateFunctions(req)
  }

  return new Promise((resolve, reject) => {

    if (ok) {

      async.map(PageObject.sections, SectionRenderer(renderData, req), (err, resolvedSections) => {

        if (err) {

          console.log('async map error\n', err)

          return void reject(err)
        }

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

        ComponentsStylesCompiler(req.app.locals[RequestKeys.CurrentTemplatePath], (err, ComponentsStyle) => {

          if (err) {
            /**
             * TODO(error): Error handling
             * @date - 7/14/17
             * @time - 3:14 PM
             */
            RaygunClient.send(err)
            // Gracefully ignore scss compilation error but notify user about the issue
            ComponentsStyle = ''
          }

          autoPrefixCss(ComponentsStyle + '\n' + SectionStyles, (err, CompiledStyles) => {

            renderFile(
              pathResolve(req.app.locals[RequestKeys.CurrentTemplatePath], 'index.ejs'),
              {
                ...renderData,
                TemplateContent,
                CompiledStyles,
                SectionScripts
              },
              (err, html) => {
                if (err) {
                  RaygunClient.send(err)
                  return reject(err)
                }
                resolve(html)
              }
            )
          })
        })
      })

    } else {

      reject(new Error('file not found'))
    }
  })
}

export async function commonRenderer (req: Request, res: Response) {

  let renderedTemplate

  try {

    renderedTemplate = await fakeTemplateRenderer(req)

  } catch (e) {

    RaygunClient.send(e)

    console.log('template renderer error\n', e)

    return void errorPageRenderer(req, res, {
      title: 'Internal Server Error',
      statusCode: 500
    })
  }

  const urlHash = stringToCacheKey(req.hostname, '-', req.url)

  res.send(renderedTemplate)

  if (Globals.Production) {

    const minified = minifyTemplate(renderedTemplate, true)

    // Do not rely on the cache write to serve the rendered content
    redisPageCacheClient.set(urlHash, minified, err => {

      if (err) {
        /**
         * TODO(error): Error handling
         * @date - 7/10/17
         * @time - 7:09 PM
         */
        RaygunClient.send(err)
      }
    })
  }
}
