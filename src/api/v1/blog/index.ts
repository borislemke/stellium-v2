import { Router } from 'express'
import { createBlogPost } from './create_post'

export const V1BlogRouter: Router = Router()

V1BlogRouter.post('/', createBlogPost)
