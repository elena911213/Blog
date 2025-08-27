document.addEventListener('DOMContentLoaded', () => {
  const navPlaceholder = document.getElementById('nav-placeholder');
  fetch('data/nav.json')
    .then(response => response.json())
    .then(data => {
      let navHTML = `<nav class="navbar">
        <a href="/" class="brand">${data.brand}</a>
        <ul class="nav-links">`;
      
      data.links.forEach(link => {
        navHTML += `<li><a href="${link.url}">${link.title}</a></li>`;
      });
      
      navHTML += `</ul></nav>`;
      navPlaceholder.innerHTML = navHTML;
    })
    .catch(error => console.error('導覽列載入失敗:', error));
});