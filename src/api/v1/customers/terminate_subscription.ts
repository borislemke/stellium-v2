import { Request, Response } from 'express'
import { Delicate } from '../../../utils/assertion/index'
import { STATUS } from '../../../utils/response_code'

const clientDataSchema = {
  client_id: {
    type: 'string',
    min: 16,
    max: 16
  }
}

export const terminateSubscription = (req: Request, res: Response) => {
  const {err, asserted: clientData} = Delicate(req.body, clientDataSchema)

  if (err) {
    res.status(STATUS.BAD_REQUEST).send(err)
  }

  const {client_id} = clientData
}
