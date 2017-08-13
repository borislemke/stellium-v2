import { Request } from 'express'

export type StelliumHostname = string

export const extractStelliumDomain = (req: Request): StelliumHostname =>
  req.headers['stellium-domain'] as string || req.hostname
