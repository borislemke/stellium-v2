import { Request, Response } from 'express'
import { renderFile } from 'ejs'
import { resolve } from 'path'
import { Globals } from '../globals'
import { RaygunClient } from '../utils/raygun'

export interface ErrorObject {
  statusCode: number
  title: string
}

const defaultError = {
  statusCode: 500,
  title: 'Internal Server Error'
}

export const errorPageRenderer = (req: Request, res: Response, data: ErrorObject = defaultError): void => {
  renderFile(
    resolve(Globals.ViewsPath, 'errors', 'default.ejs'),
    data,
    (err, html) => {
      if (err) {
        console.log('err\n', err)
        RaygunClient.send(err)
        return void res.sendStatus(500)
      }
      res.status(data.statusCode).send(html)
    }
  )
}
