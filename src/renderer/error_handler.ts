import { Request, Response } from 'express'
import { renderFile } from 'ejs'
import { resolve } from 'path'
import { Globals } from '../globals'

const defaultError = {
  statusCode: 500,
  title: 'Internal Server Error'
}

export const errorPageRenderer = (req: Request, res: Response, data: any = defaultError): void => {
  renderFile(
    resolve(Globals.ViewsPath, 'errors', 'default.ejs'),
    data,
    (err, html) => {
      if (err) {
        console.log('err\n', err)
        /**
         * TODO(error): Error handling
         * @date - 7/9/17
         * @time - 12:51 AM
         */
        return void res.sendStatus(500)
      }
      res.status(data.statusCode).send(html)
    }
  )
}
