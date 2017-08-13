export class Response {
  send: (payload: any) => void
  sendStatus: (statusCode: number) => void
}
