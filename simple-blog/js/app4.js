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
};

var Store = {
  get: function(key) {
    return localStorage.getItem(key);
  },
  set: function(key, text) {
    localStorage(key, text);
  },
  getNumber: function(key) {
    return +localStorage.getItem(key);
  },
  setNumber: function(key, number) {
    localStorage.setItem(key, number);
  },
  getObject: function(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  setObject: function(key, object) {
    localStorage.setItem(key, JSON.stringify(object));
  }
};

var Blog = function(prefix) {
  var TOTALKEY = 'total';
  var post;

  this.getAllPostCount = function() {
    return Store.getNumber(prefix+TOTALKEY);
  };

  this.getLatestPostId = function() {
    return this.getAllPostCount();
  };

  this.incrementPostId = function() {
    var cur = this.getAllPostCount();

    Store.setNumber(prefix+TOTALKEY, ++cur);
  };

  this.newPost = function() {
    var post = {};

    post.title = '';
    post.article = '';
    post.postdate = new Date();

    return post;
  };

  this.save = function(post) {
    Store.setObject(prefix+(this.getAllPostCount() + 1), post);

    this.incrementPostId();
  };

  this.loadPost = function(id) {
    post = Store.getObject(prefix+id);
    return !!post;
  };

  this.postToHTML = function(template) {
    if(!post) return null;

    post.article = post.article.replace(/\n/gi, '<br>');

    return Mustache.render(Util.getElementHTMLById(template), post)
  };

  this.pagingToHTML = function(template) {
    var i, max, html = '';

    for(i=1, max = this.getAllPostCount(); i <= max; i++) {
      html += Mustache.render(Util.getElementHTMLById(template), { index: i });
    }
    return html;
  };
};

function myApp() {
  var blog = new Blog('ibareblog-');
  var container = {
        post: Util.getElementById('post'),
        paging: Util.getElementById('paging'),
        form: Util.getElementById('postForm')
      };

  function postid() {
    return !!window.location.hash ? +window.location.hash.replace('#', '') : 1;
  }

  function show() {
    if(!container.post) return;

    if(!blog.loadPost(postid())) {
      container.paging.innerHTML = Mustache.render(Util.getElementHTMLById('tmpl-message'), { message: '글이 없습니다' });
      return;
    }

    container.post.innerHTML = blog.postToHTML('tmpl-post');
    container.paging.innerHTML = blog.pagingToHTML('tmpl-page');
  }

  if(container.form) {
    container.form.onsubmit = function(event) {
      var f = event.currentTarget;
      var post = blog.newPost();

      if(!Util.checkEmpty(f.title, '제목')) return false;
      if(!Util.checkEmpty(f.article, '내용')) return false;

      post.title = f.title.value;
      post.article = f.article.value;

      blog.save(post)

      alert('저장되었습니다.');

      location.href = 'index.html#'+blog.getLatestPostId();
      return false;
    };

    Util.getElementById('cancel').onclick = function(event) {
      location.href = 'index.html';
    };
  }

  window.onhashchange = show;

  show();
}

window.onload = myApp;
