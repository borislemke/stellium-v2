import { Router } from 'express'
import { listPages } from './list_pages'

export const V1PagesRouter: Router = Router()

V1PagesRouter.get('/', listPages)
