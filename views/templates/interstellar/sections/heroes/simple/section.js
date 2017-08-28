;(function () {
  const sectionContent = document.querySelector('[:host].header-content')
  if (!sectionContent) {
    return
  }

  const position = function () {
    if (sectionContent.getBoundingClientRect().bottom > 0) {
      const doc = document.documentElement
      const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
      sectionContent.style.transform = 'translateY(' + (top * 0.24) + 'px)'
    }
  }

  window.addEventListener('scroll', function () {
    position()
  })
})()
