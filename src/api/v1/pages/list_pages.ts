import { NextFunction, Request, Response } from 'express'
import { extractStelliumDomain } from '../../../utils/extract_stellium_domain'
import { WebsitePageModel } from '../../../models/models/website_page'

export const listPages = async (req: Request, res: Response, next: NextFunction) => {
  const hostname = extractStelliumDomain(req)

  try {
    const pages = await WebsitePageModel.find({hostname}).lean()

    res.send(pages)
  } catch (err) {
    next(err)
  }
}
