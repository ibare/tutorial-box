window.onload = myApp;

function myApp() {
  var article = {};
  var Util = {
    getElementById: function(id) {
      return document.getElementById(id);
    },
    getElementHTMLById: function(id) {
      return document.getElementById(id).innerHTML;
    },
    checkEmpty: function(control, item) {
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
    var container = Util.getElementById('post');
    var post = JSON.parse(localStorage.getItem('post-'+article.currentID()));

    if(!container) return;
    if(article.total <= 0) return;

    post.article = post.article.replace(/\n/gi, '<br>');

    container.innerHTML = Mustache.render(Util.getElementHTMLById('tmpl-post'), post);
  }

  function paging() {
    var container = Util.getElementById('paging');
    var i;

    if(!container) return;

    if(article.total <= 0) {
      container.innerHTML = Mustache.render(Util.getElementHTMLById('tmpl-message'), { message: '글이 없습니다' });
      return;
    }

    container.innerHTML = "";

    for(i=1; i <= article.total; i++) {
      container.innerHTML += Mustache.render(Util.getElementHTMLById('tmpl-page'), { index: i });
    }
  }

  function configForm() {
    var form = Util.getElementById('postForm');

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

        location.href = 'index3.html#'+article.total;

        return false;
      };

      document.getElementById('cancel').onclick = function(event) {
        location.href = 'index3.html';
      };
    }
  }
}
