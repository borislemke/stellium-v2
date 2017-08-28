function getByName (key) {
  var selector = 'input[name="' + key + '"]'

  var element = document.querySelector(selector)

  if (element.getAttribute('type') === 'checkbox') {
    return element.checked
  }

  return element.value
}

document.getElementById('reset-password').addEventListener('submit', function (e) {
  e.preventDefault()

  if (getByName('new_password') !== getByName('confirm_password')) {
    window.alert('Password do not match')
    return
  }

  var urlParams = new window.URLSearchParams(window.location.search)
  if (!urlParams.has('token') || !urlParams.has('email')) {
    window.alert('The data of this page seems malformed, please re-open the link from the email')
    return
  }

  axios.post('http://api.stellium.dev/v1/customers/reset', {
    password: getByName('new_password'),
    token: urlParams.get('token'),
    email: urlParams.get('email')
  })
    .then(response => {
      if (response && response.data) {
        window.alert('Password successfully set')
        return
      }
      console.log('response\n', response)
    })
    .catch((error) => {
      console.log('error\n', error)
    })
})
