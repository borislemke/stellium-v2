import { Router } from 'express'
import { Midtrans, MidtransEnv } from './midtrans'
import { APIPaymentsCharge } from './charge'

export const APIPaymentsRouter: Router = Router()

Midtrans.ServerKey = 'VT-server-qfS1CLXjSfKHAoJhzaTaR_uu'

Midtrans.Environment = MidtransEnv.Sandbox // Defaults to sandbox

APIPaymentsRouter.post('/', APIPaymentsCharge)
