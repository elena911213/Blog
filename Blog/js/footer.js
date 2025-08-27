document.addEventListener('DOMContentLoaded', () => {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  fetch('data/footer.json')
    .then(response => response.json())
    .then(data => {
      let footerHTML = `<footer class="site-footer">
        <div class="social-links">`;
      
      data.social_links.forEach(link => {
        footerHTML += `<a href="${link.url}" class="social-icon">
          <i class="${link.icon}"></i>
        </a>`;
      });
      
      footerHTML += `</div>
        <p class="copyright">${data.copyright}</p>
      </footer>`;
      footerPlaceholder.innerHTML = footerHTML;
    })
    .catch(error => console.error('頁腳載入失敗:', error));
});