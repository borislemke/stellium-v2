import { NextFunction, Request, Response } from 'express'

export abstract class ResourceController {

  /**
   * Express Request object injected during route initialization
   */
  request: Request

  /**
   * Express Response object injected during route initialization
   */
  response: Response

  /**
   * Express NextFunction method injected during route initialization
   */
  next: NextFunction

  /**
   * Incoming request handler for GET method
   */
  index? (): void

  store? (): void

  show? (): void

  update? (): void

  destroy? (): void
}

export class BaseController extends ResourceController {

  protected get modelId (): string {
    return this.request.params['modelId']
  }

  bootstrap (req: Request, res: Response, next: NextFunction) {
    this.request = req
    this.response = res
    this.next = next
    return this
  }
}
