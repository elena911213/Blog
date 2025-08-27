document.addEventListener('DOMContentLoaded', function() {
    // 獲取URL參數
    const urlParams = new URLSearchParams(window.location.search);
    const articleNo = urlParams.get('no');
    
    // 根據是否有no參數設定page值
    const pageInput = document.querySelector('input[name="page"]');
    if (articleNo) {
        pageInput.value = "編輯";
    } else {
        pageInput.value = "新增";
    }

    // 載入文章分類選項
    const categorySelect = document.getElementById('postCategory');
    
    fetch('../data/categories.json')
        .then(response => response.json())
        .then(data => {
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.slug;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
            
            // 如果有文章編號，則取得文章資料並填充表單
            if (articleNo) {
                fetchArticleData(articleNo);
            }
            
            // 表單提交處理
            document.getElementById('postForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // 取得表單資料並處理內容
                const noInput = document.querySelector('input[name="no"]');
                const kpInput = document.querySelector('input[name="kp"]');
                const rawContent = tinymce.get('postContent').getContent();
                const processedContent = escapeContent(rawContent); // 轉換換行和引號
                
                const formData = {
                    title: document.getElementById('postTitle').value,
                    content: processedContent,
                    category: document.getElementById('postCategory').value,
                    page: document.querySelector('input[name="page"]').value,
                    pwd: document.getElementById('adminPwd').value,
                    no: noInput ? noInput.value : '', // 從隱藏欄位取得文章編號
                    kp: kpInput ? kpInput.value : ''  // 從隱藏欄位取得主鍵索引
                };
            
                try {
                    // 取得webhook URL
                    const response = await fetch('../data/webhook.json');
                    const webhookConfig = await response.json();
                    
                    // 發送資料到webhook
                    const result = await fetch(webhookConfig.endpoints.article_submit, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });
            
                    if (result.ok) {
                        alert('文章提交成功！');
                        document.getElementById('postForm').reset();
                        tinymce.get('postContent').setContent('');
                    } else {
                        throw new Error('伺服器回應異常');
                    }
                } catch (error) {
                    console.error('提交失敗:', error);
                    alert('文章提交失敗，請檢查控制台訊息');
                }
            });
        })
        .catch(error => console.error('分類載入失敗:', error));
});

// 取得文章資料的函式
function fetchArticleData(articleNo) {
    // 這裡應該發送請求到後端取得文章資料
    // 假設端點為 /api/get_article?no=文章編號
    fetch(`/api/get_article?no=${articleNo}`)
        .then(response => response.json())
        .then(article => {
            // 處理內容：將<br>換回換行符號，將\"換回雙引號
            const unescapedContent = unescapeContent(article.content || '');
            
            // 填充表單欄位
            document.getElementById('postTitle').value = article.title || '';
            tinymce.get('postContent').setContent(unescapedContent);
            document.getElementById('postCategory').value = article.class || ''; // 使用 class 欄位
            document.getElementById('adminPwd').value = ''; // 密碼欄位清空
            
            // 創建或更新隱藏欄位用於儲存文章編號
            let noInput = document.querySelector('input[name="no"]');
            if (!noInput) {
                noInput = document.createElement('input');
                noInput.type = 'hidden';
                noInput.name = 'no';
                document.getElementById('postForm').appendChild(noInput);
            }
            noInput.value = article.id; // 設置文章編號
            
            // 創建或更新隱藏欄位用於儲存主鍵索引 kp
            let kpInput = document.querySelector('input[name="kp"]');
            if (!kpInput) {
                kpInput = document.createElement('input');
                kpInput.type = 'hidden';
                kpInput.name = 'kp';
                document.getElementById('postForm').appendChild(kpInput);
            }
            kpInput.value = article.kp; // 設置主鍵索引
        })
        .catch(error => {
            console.error('取得文章資料失敗:', error);
            alert('無法載入文章資料，請檢查文章編號');
        });
}

// 轉換內容：換行符號轉為<br>，雙引號轉為\"
function escapeContent(content) {
    return content
        .replace(/\n/g, '<br>') // 換行符號轉為<br>
        .replace(/"/g, '\\"');   // 雙引號轉為\"
}

// 還原內容：<br>轉為換行符號，\"轉為雙引號
function unescapeContent(content) {
    return content
        .replace(/<br>/g, '\n') // <br>轉為換行符號
        .replace(/\\"/g, '"');   // \"轉為雙引號
}