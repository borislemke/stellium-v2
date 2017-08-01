import * as raygun from 'raygun'
import { Globals } from '../globals'

export const RaygunClient = new raygun.Client().init({apiKey: 'PLC5SxxtwYijzaQ66rtMdg=='})

const originalMethod = RaygunClient.send

const overrideRaygunSend = (errText: any, err?: any) => {
  let rayError

  if (typeof errText === 'string' && typeof err !== 'undefined') {
    console.log('Error caught by Raygun\n', errText)
    rayError = err
  }

  if (Globals.Production) {
    originalMethod(rayError)
  }
}

RaygunClient.send = overrideRaygunSend
