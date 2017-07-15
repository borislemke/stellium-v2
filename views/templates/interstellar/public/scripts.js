(function () {
  var sectionContent = document.querySelector('.header-wrapper')

  console.log('sectionContent\n', sectionContent)

  window.addEventListener('scroll', function (e) {
    var doc = document.documentElement

    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

    sectionContent.style.transform = 'translateY(' + (top * 0.15) + 'px)'
  })
})()
