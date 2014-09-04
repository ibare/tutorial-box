window.onload = myApp;

function myApp() {
  var article = {};

  article.currentID = function () {
    var id = window.location.hash;

    id = !!id ? +id.replace('#', '') : 1;

    return id;
  };

  article.total = localStorage.getItem('total') || 0;

  showPost();
  paging();
  configForm();

  window.onhashchange = showPost;

  function showPost() {
    var container = document.getElementById('post');
    var ele, text, post;

    if(!container) return;
    else container.innerHTML = "";

    if(article.total <= 0) return;

    post = JSON.parse(localStorage.getItem('post-'+article.currentID()));

    ele = document.createElement('h2');
    ele.appendChild(document.createTextNode(post.title))

    container.appendChild(ele);

    ele = document.createElement('p');
    ele.appendChild(document.createTextNode(post.postdate))
    ele.setAttribute('class', 'date');

    container.appendChild(ele);

    ele = document.createElement('p');
    ele.innerHTML = post.article.replace(/\n/gi, '<br>');
    ele.setAttribute('class', 'article');

    container.appendChild(ele);
  }

  function paging() {
    var container = document.getElementById('paging');
    var i, ele, text;

    if(!container) return;

    if(article.total <= 0) {
      ele = document.createElement('p');
      text = document.createTextNode('글이 없습니다.');

      ele.appendChild(text);
      container.appendChild(ele);
      return;
    }

    for(i=1; i <= article.total; i++) {
      ele = document.createElement('a');
      ele.appendChild(document.createTextNode(i));

      ele.setAttribute('href', '#'+i);

      container.appendChild(ele);
    }
  }

  function configForm() {
    var form = document.getElementById('postForm');

    if(form) {
      form.onsubmit = function(event) {
        var f = event.currentTarget;
        var post = {};

        if(f.title.value == '') {
          alert('제목이 없습니다.');
          return false;
        }

        if(f.article.value == '') {
          alert('내용이 없습니다.');
          return false;
        }

        article.total++;

        post.title = f.title.value;
        post.article = f.article.value;
        post.postdate = new Date();

        localStorage.setItem('total', article.total);
        localStorage.setItem('post-'+article.total, JSON.stringify(post));

        alert('저장되었습니다.');

        location.href = 'index.html';

        return false;
      };

      document.getElementById('cancel').onclick = function(event) {
        location.href = 'index.html';
      };
    }
  }
}
