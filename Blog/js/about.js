document.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.getElementById('about-section');
  
  // 加载关于页面内容
  function loadAboutContent() {
    fetch('data/about.json')
      .then(response => response.json())
      .then(data => {
        renderAboutContent(data);
      })
      .catch(error => console.error('關於頁面載入失敗:', error));
  }

  // 渲染关于页面内容
  function renderAboutContent(data) {
    const skillsHTML = data.skills.map(skill => 
      `<li class="skill-item">${skill}</li>`
    ).join('');

    const socialLinksHTML = data.social_links.map(link => 
      `<a href="${link.url}" class="social-link" target="_blank" rel="noopener">
        <i class="${link.icon}"></i>
        <span>${link.platform}</span>
      </a>`
    ).join('');

    aboutSection.innerHTML = `
      <article class="about-card">
        <h2>${data.title}</h2>
        <div class="author-profile">
          <img src="${data.author.image}" alt="${data.author.name}" class="author-avatar">
          <div class="author-info">
            <h3>${data.author.name}</h3>
            <p class="author-position">${data.author.position}</p>
            <p class="author-bio">${data.author.bio}</p>
          </div>
        </div>
        
        <div class="skills-section">
          <h4>專業技能</h4>
          <ul class="skills-list">
            ${skillsHTML}
          </ul>
        </div>
        
        <div class="social-section">
          <h4>社交媒體</h4>
          <div class="social-links-grid">
            ${socialLinksHTML}
          </div>
        </div>
      </article>
    `;
  }

  // 初始化
  if (aboutSection) {
    loadAboutContent();
  }
});

// 导出函数供其他模块使用
window.aboutModule = {
  loadAboutContent: function() {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      fetch('data/about.json')
        .then(response => response.json())
        .then(data => {
          aboutSection.style.display = 'block';
          renderAboutContent(data);
        })
        .catch(error => console.error('關於頁面載入失敗:', error));
    }
  }
};