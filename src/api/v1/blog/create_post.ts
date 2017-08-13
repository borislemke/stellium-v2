import { NextFunction, Request, Response } from 'express'
import { Delicate } from '../../../utils/assertion/index'

const blogFilter = {
  title: {
    type: 'string'
  }
}

export const createBlogPost = (req: Request, res: Response, next: NextFunction) => {
  const {err, asserted: blogData} = Delicate(req.body, blogFilter)
}
