# Midtrans Library for Node.js

## Examples

### Generating a token (Snap)

**ESNext / TypeScript**
```javascript
import { Midtrans, MidtransEnv } from 'midtrans'

// Must set ServerKey before use of library
Midtrans.ServerKey = 'Your-Server-Key'

// defaults to Sandbox
Midtrans.Environment = MidtransEnv.Production

app.post('/token', async function (req, res) {
  const {err, token} = await Midtrans.createToken({
    transaction_details: {
      order_id: 'Foo-Bar',
      gross_amount: 200000
    }
  })

  if (err) {
    // Your error handler
    return void res.sendStatus(500)
  }

  res.send(token)
})
```

**Peasant's JavaScript**
```javascript
var midtrans = require('midtrans')
var Midtrans = midtrans.Midtrans
var MidtransEnv = midtrans.MidtransEnv

// Must set ServerKey before use of library
Midtrans.ServerKey = 'Your-Server-Key'

// defaults to Sandbox
Midtrans.Environment = MidtransEnv.Production

app.post('/token', function (req, res) {

  Midtrans.createToken({
    transaction_details: {
      order_id: 'Foo-Bar',
      gross_amount: 200000
    }
  })
  .then(function (result) {
    if (result.err) {
      // Your error handler
      return void res.sendStatus(500)
    }

    res.send(result.token)
  })
})
```

### Making a charge

**ESNext/TypeScript**
```javascript
import { Midtrans, PaymentMethods } from 'midtrans'

app.post('/charge', async function (req, res) {

  const {err, response} = await Midtrans.charge({
    payment_method: PaymentMethods.CreditCard,
    transaction_details: {
      order_id: '12345',
      gross_amount: 200000,
    },
    credit_card: {
      token_id: 'YOUR-CC-TOKEN',
    },
    items: [
      {
        id: "ITEM1",
        price: 200000,
        quantity: 1,
        name: 'Some item'
      }
    ]
  })

  if (err) {
    // Your error handler
    return void res.sendStatus(500)
  }

  res.send(response)
})
```

**Peasant's JavaScript**
```javascript
var midtrans = require('midtrans')
var Midtrans = midtrans.Midtrans
var PaymentMethods = midtrans.PaymentMethods

app.post('/charge', function (req, res) {

  Midtrans.charge({
    payment_method: PaymentMethods.CreditCard,
    transaction_details: {
      order_id: '12345',
      gross_amount: 200000,
    },
    credit_card: {
      token_id: 'YOUR-CC-TOKEN',
    },
    items: [
      {
        id: "ITEM1",
        price: 200000,
        quantity: 1,
        name: 'Someitem'
      }
    ]
  })
  .then(function (result) {

    if (result.err) {
      // Your error handler
      return void res.sendStatus(500)
    }

    res.send(result.response)
  })
})
```

### Snap


**ESNext / TypeScript**
```javascript
import { Midtrans, MidtransEnv } from 'midtrans'

Midtrans.ServerKey = 'Your-Server-Key'

// Defaults to Sandbox
Midtrans.Environment = MidtransEnv.Production

app.post('/snap-token', async function (req, res) {

  const {token, err} = await Midtrans.CreateSnapToken({
    transactions_details: {
      order_id: 'Foo-Bar',
      gross_amount: 145000
    }
  })

  if (err) {
    // Your error handler
    return void res.sendStatus(500)
  }

  res.send(token)
})
```

**Peasant's JavaScript**
```javascript
var midtrans = require('midtrans')
var Midtrans = midtrans.Midtrans
var MidtransEnv = midtrans.MidtransEnv

app.post('/snap-token', function (req, res) {
  Midtrans.createSnapToken({
    transactions_details: {
      order_id: 'Foo-Bar',
      gross_amount: 145000
    }
  })
  .then(function (result) {

    if (result.err) {
      // Your error handler
      return res.sendStatus(500)
    }

    res.send(result.token)
  })
})
```

**Client Side**
```
// Either inject token during page render or fetch
// via AJAX before making purchase
snap.pay(token, {
  onSuccess: function () { alert('Payment Accepted') },
  onPending: function (res) {
    alert('Payment Pending')
    // Your pending handler
    console.log(res)
  },
  onError: function (err) {
    // Your error handler
    console.log(err)
  }
})
```
