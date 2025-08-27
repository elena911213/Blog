document.addEventListener('DOMContentLoaded', () => {
  // 选项卡切换功能
  function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const contentSections = document.querySelectorAll('.content-section');

    // 初始显示首页内容
    showSection('home');

    // 为每个选项卡按钮添加点击事件
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        // 更新按钮激活状态
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // 显示对应的内容区域
        showSection(tabName);
      });
    });
  }

  // 显示指定选项卡的内容
  function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    
    // 隐藏所有内容区域
    sections.forEach(section => {
      section.style.display = 'none';
    });

    // 显示选中的内容区域
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.style.display = 'block';
      
      // 根据选项卡加载相应的内容
      switch(sectionName) {
        case 'home':
          if (window.postsModule) {
            window.postsModule.loadPostsList();
          }
          break;
        case 'about':
          if (window.aboutModule) {
            window.aboutModule.loadAboutContent();
          }
          break;
        case 'article':
          // 文章详情页面已经在点击阅读更多时加载
          break;
      }
    }
  }

  // URL 路由功能（可选）
  function initRouting() {
    // 监听URL hash变化
    window.addEventListener('hashchange', handleHashChange);
    
    // 初始处理当前hash
    handleHashChange();
  }

  function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    if (hash.startsWith('article-')) {
      const articleId = hash.split('-')[1];
      if (window.postsModule) {
        window.postsModule.loadArticleDetail(articleId);
        switchTab('article');
      }
    }
  }

  // 切换选项卡的公共函数
  window.switchTab = function(tabName) {
    const button = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    if (button) {
      button.click();
    }
  };

  // 初始化
  initTabNavigation();
  initRouting();
});