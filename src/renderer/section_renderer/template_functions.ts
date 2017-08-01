import { Request } from 'express'
import { MediaFileSchema } from '../../models/schemas/media_file'
import { RequestKeys } from '../../helpers/request_keys'
import { Translatable } from '../../models/schemas/_common'

export interface MediaObject {
  source: string
  url: string
}

export class DomCompiler {
}

export class TemplateFunctions {

  domCompiler: DomCompiler = new DomCompiler()

  MediaFiles: MediaFileSchema[]

  private CurrentLanguages: string

  constructor (private req: Request) {

    this.CurrentLanguages = req.app.locals[RequestKeys.CurrentLanguage]

    this.MediaFiles = req.app.locals[RequestKeys.DBMediaFiles]
  }

  translate (translatabe: Translatable) {
    return translatabe[this.CurrentLanguages]
  }

  mediaPath (media: MediaObject) {

    let url

    switch (media.source) {
      case 'internal':
        url = 'media/' + this._findMediaUrlById(media.url)
    }
  }

  private _findMediaUrlById (id: string): string {

    const match = this.MediaFiles.find(_media => _media._id === id)

    return match && match.url
  }
}
