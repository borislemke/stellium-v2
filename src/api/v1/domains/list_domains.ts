import { NextFunction, Request, Response } from 'express'
import { DomainModel } from '../../../models/models/stellium_domain'

export const listDomains = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const domains = await DomainModel.find({
      $or: {
        created_by: req.user._id,

      }
    })

    res.send(domains)
  } catch (e) {
    next(e)
  }
}
