import { Router } from 'express'
import { createDomain } from './create_domain'
import { listDomains } from './list_domains'

export const V1DomainsRouter: Router = Router()

V1DomainsRouter.get('/', listDomains)

V1DomainsRouter.post('/', createDomain)
