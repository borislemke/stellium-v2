import { resolve } from 'path'
import { renderFile } from 'ejs'
import { Globals } from '../globals'
import * as nodemailer from 'nodemailer'
import * as mandrillTransport from 'nodemailer-mandrill-transport'

const emailsDir = resolve(Globals.ViewsPath, 'emails')

/**
 * TODO(opt): Replace with RabbitMQ plug
 * @date - 23-08-2017
 * @time - 22:14
 */
export const GlobalMailer = (template: string, recipient: string, data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    renderFile(emailsDir + '/index.ejs', {
      template,
      ...data
    }, (err, html) => {
      if (err) {
        reject(err)
        return
      }

      const transport = nodemailer.createTransport(mandrillTransport({
        auth: {
          apiKey: 'TUfyEr6FBHM4OnoYH8_Cdg'
        }
      }))

      transport.sendMail({
        from: 'boris@fleava.com',
        to: recipient,
        subject: data.title,
        html
      }, (err, info) => {
        if (err) {
          reject(err)
          return
        }
        console.log('info\n', info)
        resolve(null)
      })
    })
  })
}

/**
 * Mandrill Success Response
 * { messageId: 'e4d7515785c147d4afa67e7e94112961',
 * accepted:
 *  [ { email: 'dimas.lemke@midtrans.com',
 *      status: 'sent',
 *      _id: 'e4d7515785c147d4afa67e7e94112961',
 *      reject_reason: null } ],
 * rejected: [] }
 */
