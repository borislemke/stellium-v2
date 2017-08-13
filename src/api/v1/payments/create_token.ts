// import { Client } from 'midtrans'

/*
export async function APIPaymentToken (req, res) {

  try {
    const token = await Client.createToken({
      transaction_details: {
        order_id: 'boris-' + Date.now(),
        gross_amount: 145000
      }
    })

    console.log('token\n', token)

    res.send(token)

  } catch (error) {
    console.log('error\n', error)

    res.status(500).send(error)
  }
}

// Fallback to the experimental await function
function peasantsOnlyPayment () {

  Client
    .createToken({
      transaction_details: {
        order_id: 'boris-' + Date.now(),
        gross_amount: 145000
      }
    })
    .then((result) => {
      if (result.err) {
        console.log('There was an error', result.err)
        return
      }
      console.log('Heres the token', result.token)
    })
}
*/
