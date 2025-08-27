document.addEventListener('DOMContentLoaded', () => {
  const articleSection = document.getElementById('article-section');
  const homeSection = document.getElementById('home-section');
  
  // 加载文章列表
  function loadPostsList() {
    fetch('data/posts.json')
      .then(response => response.json())
      .then(data => {
        renderPostsList(data.posts);
      })
      .catch(error => console.error('文章列表載入失敗:', error));
  }

  // 渲染文章列表
  function renderPostsList(posts) {
    const postsHTML = posts.map(post => `
      <article class="article-card" data-article-id="${post.id}">
        <h2>${post.title}</h2>
        <div class="meta">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <span class="author">${post.author}</span>
        </div>
        <p>${post.excerpt}</p>
        <a href="#" class="read-more" data-article-id="${post.id}">閱讀更多</a>
      </article>
    `).join('');

    homeSection.querySelector('.article-list').innerHTML = postsHTML;
    
    // 添加事件监听器
    document.querySelectorAll('.read-more').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = e.target.dataset.articleId;
        loadArticleDetail(articleId);
        switchTab('article');
      });
    });
  }

  // 加载文章详情
  function loadArticleDetail(articleId) {
    fetch('data/posts.json')
      .then(response => response.json())
      .then(data => {
        const post = data.posts.find(p => p.id == articleId);
        if (post) {
          renderArticleDetail(post);
        }
      })
      .catch(error => console.error('文章詳情載入失敗:', error));
  }

  // 渲染文章详情
  function renderArticleDetail(post) {
    articleSection.innerHTML = `
      <article class="article-detail">
        <h1>${post.title}</h1>
        <div class="meta">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <span class="author">${post.author}</span>
          <span class="category">${post.category}</span>
        </div>
        <div class="content">
          ${post.content}
        </div>
        <div class="tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </article>
    `;
  }

  // 日期格式化
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // 初始化
  if (homeSection) {
    loadPostsList();
  }
});

// 导出函数供其他模块使用
window.postsModule = {
  loadPostsList: function() {
    const homeSection = document.getElementById('home-section');
    if (homeSection) {
      homeSection.style.display = 'block';
      fetch('data/posts.json')
        .then(response => response.json())
        .then(data => {
          renderPostsList(data.posts);
        })
        .catch(error => console.error('文章列表載入失敗:', error));
    }
  },
  
  loadArticleDetail: function(articleId) {
    const articleSection = document.getElementById('article-section');
    if (articleSection) {
      articleSection.style.display = 'block';
      fetch('data/posts.json')
        .then(response => response.json())
        .then(data => {
          const post = data.posts.find(p => p.id == articleId);
          if (post) {
            renderArticleDetail(post);
          }
        })
        .catch(error => console.error('文章詳情載入失敗:', error));
    }
  }
};