import * as async from 'async'
import { renderFile } from 'ejs'
import { resolve as pathResolve } from 'path'
import { Request, Response } from 'express'
import { Globals } from '../globals'
import { RequestKeys } from '../helpers/request_keys'
import { ModuleRenderer } from './module_renderer/index'
import { stringToCacheKey } from '../helpers/url_cache'
import { RedisTable } from '../helpers/redis_table'
import { createClient } from 'redis'
import { minifyTemplate } from './utils/minify_html'
import { errorPageRenderer } from './error_handler'

const redisPageCacheClient = createClient({db: RedisTable.PageCache})

const getSettingsByKey = (collection: any[]) => (key: string): any => {
  const matching = collection.find(_collection => _collection.key === key)
  return matching && matching.value || null
}

function fakeTemplateRenderer (req: Request, ok: boolean = true): Promise<string> {

  // const PageObject = req.app.locals[RequestKeys.CurrentPageObject]

  // Force delete node cache before requiring file
  delete require.cache[Globals.ViewsPath + '/test.json']
  const PageObject = require(Globals.ViewsPath + '/test.json')

  return new Promise((resolve, reject) => {

    if (ok) {

      async.map(PageObject.modules, ModuleRenderer(PageObject, req.app.locals), (err, resolvedModules) => {

        if (err) {
          console.log('async map error\n', err)
          return void reject(err)
        }

        req.app.locals[RequestKeys.RenderedTemplate] = resolvedModules.map(_mod => _mod.template).join('\n')

        renderFile(
          pathResolve(Globals.TemplatesPath, req.app.locals[RequestKeys.CurrentTemplate], 'index.ejs'),
          {
            getSettingsByKey: getSettingsByKey(req.app.locals[RequestKeys.DBSettings]),
            RequestKeys,
            ...req.app.locals,
            PageObject
          },
          (err, html) => {
            if (err) {
              return reject(err)
            }
            resolve(html)
          }
        )
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
    console.log('template renderer error\n', e)
    return void errorPageRenderer(req, res, {
      title: 'Internal Server Error',
      statusCode: 500
    })
  }

  const urlHash = stringToCacheKey(req.hostname, '-', req.url)

  // Do not rely on the cache write to serve the rendered content
  redisPageCacheClient.set(urlHash, minifyTemplate(renderedTemplate, true), err => {
    if (err) {
      /**
       * TODO(error): Error handling
       * @date - 7/10/17
       * @time - 7:09 PM
       */
    }
  })

  res.send(renderedTemplate)
}
