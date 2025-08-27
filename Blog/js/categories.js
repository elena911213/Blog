document.addEventListener('DOMContentLoaded', () => {
  const categoryNav = document.getElementById('category-nav');
  fetch('data/categories.json')
    .then(response => response.json())
    .then(data => {
      let categoryHTML = `<div class="category-nav">
        <h3>文章分類</h3>
        <ul class="category-list">`;
      
      data.categories.forEach(category => {
        categoryHTML += `
          <li>
            <a href="/category/${category.slug}" class="category-link">
              <i class="${category.icon}"></i>
              ${category.name}
            </a>
          </li>`;
      });
      
      categoryHTML += `</ul></div>`;
      categoryNav.innerHTML = categoryHTML;
    })
    .catch(error => console.error('分類載入失敗:', error));
});