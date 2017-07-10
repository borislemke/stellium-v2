import { Router } from 'express'
import { pageLoaderMiddleware } from './page_loader'
import { commonRenderer } from './common_renderer'

export const RendererRouter: Router = Router()

RendererRouter.use(pageLoaderMiddleware)

RendererRouter.use(commonRenderer)
