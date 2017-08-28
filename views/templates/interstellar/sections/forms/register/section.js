function getByEmail (key) {
  var selector = 'input[name="' + key + '"]'

  var element = document.querySelector(selector)

  if (element.getAttribute('type') === 'checkbox') {
    return element.checked
  }

  return element.value
}

document.querySelector('[:host]#register').addEventListener('submit', function (e) {
  e.preventDefault()

  axios.post('http://api.stellium.dev/v1/customers/register', {
    email: getByEmail('email'),
    password: getByEmail('password'),
    first_name: getByEmail('first_name'),
    last_name: getByEmail('last_name'),
    eula: getByEmail('eula'),
    extraStuff: 'blah'
  })
    .then(response => {
      console.log('response\n', response)
    })
    .catch(error => {
      console.log('error\n', error)
    })
})

document.getElementById('login').addEventListener('submit', function (e) {
  e.preventDefault()

  axios.post('http://api.stellium.dev/v1/customers/login', {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value
  })
    .then(response => {
      if (response && response.data && response.data.token) {
        window.localStorage.setItem('auth', response.data.token)
        window.location.href = '/admin'
        return
      }
      console.log('response\n', response)
    })
    .catch(error => {
      console.log('error\n', error)
    })
})

document.getElementById('recovery').addEventListener('submit', function (e) {
  e.preventDefault()

  var email = document.getElementById('recovery-email').value

  axios.post('http://api.stellium.dev/v1/customers/recovery', {
    email
  })
    .then(response => {
      if (response && response.data) {
        window.alert('Recovery email sent to ' + email)
        return
      }
      console.log('response\n', response)
    })
    .catch((error, e) => {
      console.log('error\n', error)
    })
})
