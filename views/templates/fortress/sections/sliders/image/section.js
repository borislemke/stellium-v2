'use strict';

(function () {
  var title = document.querySelectorAll('[:host].title');
  for (var i = 0; i < title.length; i++) {
    title[i].addEventListener('click', function () {
      console.log('It works!')
    })
  }
})()
