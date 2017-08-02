import { Midtrans } from './midtrans/client'

export async function APIPaymentsCharge (req, res) {

  const {err, token} = await Midtrans.createToken()

  if (err) {
    console.log('sam ting wong\n', err)
    return void res.sendStatus(500)
  }

  console.log('token\n', token)
}

// Fallback to the experimental await function
function peasantsOnlyPayment () {

  Midtrans
    .createToken()
    .then((result) => {
      if (result.err) {
        console.log('There was an error', result.err)
        return
      }
      console.log('Heres the token', result.token)
    })
}
