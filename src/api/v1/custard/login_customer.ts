import { Request, Response } from 'express'
import { Delicate, DelicateSchema } from '../../../utils/assertion/index'
import { HTTPStatusCode } from '../../../utils/response_code'

const loginSchema: DelicateSchema = {
  email: {
    type: 'string'
  },
  password: {
    type: 'string',
    min: 8
  }
}

/**
 * Dummy login function
 * @param loginData
 * @returns {boolean}
 */
const login = (loginData: any) => {
  return loginData.email
    && loginData.email === 'boris@fleava.com'
    && loginData.password
    && loginData.password === 'fleava123'
}

export const loginCustomer = (req: Request, res: Response) => {
  const {err, asserted: loginData} = Delicate(req.body, loginSchema)

  if (err) {
    return void res.status(HTTPStatusCode.BAD_REQUEST).send(err)
  }

  if (!login(loginData)) {
    return void res.status(HTTPStatusCode.UNAUTHORIZED).send('incorrect username or password')
  }

  res.send('fake-jwt-token')
}
