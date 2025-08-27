document.addEventListener('DOMContentLoaded', () => {
  const recentPostsList = document.getElementById('recent-posts-list');
  
  // 加载最近文章列表
  function loadRecentPosts() {
    fetch('data/posts.json')
      .then(response => response.json())
      .then(data => {
        renderRecentPosts(data.posts);
      })
      .catch(error => console.error('最近文章載入失敗:', error));
  }

  // 渲染最近文章列表
  function renderRecentPosts(posts) {
    // 按日期排序，最新的在前
    const sortedPosts = [...posts].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    // 只显示最近的5篇文章
    const recentPosts = sortedPosts.slice(0, 5);
    
    const postsHTML = recentPosts.map(post => `
      <div class="recent-post-item" data-article-id="${post.id}">
        <a href="#" class="recent-post-link" data-article-id="${post.id}">
          <h4 class="recent-post-title">${post.title}</h4>
          <time datetime="${post.date}" class="recent-post-date">${formatDate(post.date)}</time>
        </a>
      </div>
    `).join('');

    recentPostsList.innerHTML = postsHTML;
    
    // 添加事件监听器
    document.querySelectorAll('.recent-post-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = e.currentTarget.dataset.articleId;
        if (window.postsModule) {
          window.postsModule.loadArticleDetail(articleId);
          window.switchTab('article');
        }
      });
    });
  }

  // 日期格式化
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // 初始化
  if (recentPostsList) {
    loadRecentPosts();
  }
});

// 导出函数供其他模块使用
window.recentPostsModule = {
  loadRecentPosts: function() {
    const recentPostsList = document.getElementById('recent-posts-list');
    if (recentPostsList) {
      fetch('data/posts.json')
        .then(response => response.json())
        .then(data => {
          renderRecentPosts(data.posts);
        })
        .catch(error => console.error('最近文章載入失敗:', error));
    }
  }
};