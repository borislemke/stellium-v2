document.addEventListener('scroll', function (e) {
  const navElement = document.getElementById('main-navigation')

  const {height} = navElement.getBoundingClientRect()

  if (e.target.scrollingElement.scrollTop > height) {
    navElement.parentNode.classList.add('mt-scrolled')
  } else {
    navElement.parentNode.classList.remove('mt-scrolled')
  }
})
