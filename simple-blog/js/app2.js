window.onload = myApp;

function myApp() {
  var article = {};
  var Util = {
    createElement: function(tagName, contents, container) {
      var ele = document.createElement(tagName);
      ele.innerHTML = contents;

      container.appendChild(ele);
      return ele;
    },
    checkEmpty: function(control, itme) {
      if(control.value == '') {
        alert(item+'이 없습니다.');
        return false;
      }
      return true;
    }
  }

  article.currentID = function () {
    return !!window.location.hash ? +window.location.hash.replace('#', '') : 1;
  };

  article.total = localStorage.getItem('total') || 0;

  showPost();
  paging();
  configForm();

  window.onhashchange = showPost;

  function showPost() {
    var container = document.getElementById('post');
    var post;

    if(!container) return;
    else container.innerHTML = "";

    if(article.total <= 0) return;

    post = JSON.parse(localStorage.getItem('post-'+article.currentID()));

    Util.createElement('h2', post.title, container);
    Util.createElement('p', post.postdate, container).setAttribute('class', 'date');
    Util.createElement('p', post.article.replace(/\n/gi, '<br>'), container).setAttribute('class', 'article');
  }

  function paging() {
    var container = document.getElementById('paging');
    var i;

    if(!container) return;

    if(article.total <= 0) return Util.createElement('p', '글이 없습니다.', container);

    for(i=1; i <= article.total; i++) {
      Util.createElement('a', i, container).setAttribute('href', '#'+i);
    }
  }

  function configForm() {
    var form = document.getElementById('postForm');

    if(form) {
      form.onsubmit = function(event) {
        var f = event.currentTarget;
        var post = {};

        if(!Util.checkEmpty(f.title, '제목')) return false;
        if(!Util.checkEmpty(f.article, '내용')) return false;

        article.total++;

        post.title = f.title.value;
        post.article = f.article.value;
        post.postdate = new Date();

        localStorage.setItem('total', article.total);
        localStorage.setItem('post-'+article.total, JSON.stringify(post));

        alert('저장되었습니다.');

        location.href = 'index2.html#'+article.total;

        return false;
      };

      document.getElementById('cancel').onclick = function(event) {
        location.href = 'index2.html';
      };
    }
  }
}
