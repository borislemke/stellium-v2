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

  axios.post('/api/v1/clients', {
    email: getByEmail('email'),
    password: getByEmail('password'),
    full_name: getByEmail('full_name'),
    eula: getByEmail('eula'),
    extraStuff: 'blah'
  })
    .then(response => {
      console.log('response\n', response)
    })
    .catch(e => {
      console.log('e\n', e)
    })
})
