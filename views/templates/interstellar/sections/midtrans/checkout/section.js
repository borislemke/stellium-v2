document.querySelector('[:host]#payment-form').addEventListener('submit', function (e) {
  e.preventDefault()

  console.log('e\n', e)
})
