import { Request } from 'express'
import { MediaFileSchema } from '../../models/schemas/media_file'
import { RequestKeys } from '../../helpers/request_keys'

export interface MediaObject {
  source: string
  url: string
}

export class DomCompiler {

  constructor () {}
}

export class TemplateFunctions {

  domCompiler: DomCompiler = new DomCompiler()

  mediaFiles: MediaFileSchema[]

  constructor (private req: Request) {

    this.mediaFiles = req.app.locals[RequestKeys.DBMediaFiles]
  }

  private _findMediaUrlById (id: string): string {

    const match = this.mediaFiles.find(_media => _media._id === id)

    return match && match.url
  }

  mediaPath (media: MediaObject) {

    let url

    switch (media.source) {
      case 'internal':
        url = 'media/' + this._findMediaUrlById(media.url)
    }
  }
}
