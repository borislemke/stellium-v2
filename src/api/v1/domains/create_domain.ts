import { NextFunction, Request, Response } from 'express'
import { DomainModel } from '../../../models/models/stellium_domain'
import { Delicate } from '../../../utils/assertion/index'
import { STATUS } from '../../../utils/response_code'

const domainSchema = {
  title: {
    type: 'string',
    required: true
  }
}

const generateUniqueStelliumDomain = (domainTitle: string, i: number, cb: (err?: any, address?: string) => void): void => {
  const safeUrl = domainTitle.replace(/\s/g, '-').toLowerCase()

  const permAddress = safeUrl + (i ? i : '')

  DomainModel.findOne({permanent_address: permAddress}, (err, match) => {
    if (err) {
      return cb(err)
    }

    if (match) {
      i = i ? i + 1 : 1

      return generateUniqueStelliumDomain(safeUrl, i, cb)
    }

    cb(null, safeUrl + (i ? i : ''))
  })
}

export const createDomain = (req: Request, res: Response, next: NextFunction) => {
  const {err, asserted: domainData} = Delicate(req.body, domainSchema)

  if (err) {
    res.status(STATUS.BAD_REQUEST)

    return next(err)
  }

  const userId = req.user._id

  domainData.created_by = userId

  domainData.users = [
    {
      user_id: userId, // assign default user
      role_id: 1 // Set creator as super admin
    }
  ]

  domainData.languages = [
    {
      title: 'English',
      code: 'en',
      user_id: userId,
      status: true,
      'default': true,
      created_at: Date.now()
    }
  ]

  generateUniqueStelliumDomain(domainData.title, null, (err, address) => {
    if (err) {
      return next(err)
    }

    domainData.permanent_address = address

    DomainModel.create(domainData, err => {
      if (err) {
        return next(err)
      }

      res.send({
        message: 'Domain ' + domainData.title + ' created successfully',
        url: address
      })
    })
  })
}
