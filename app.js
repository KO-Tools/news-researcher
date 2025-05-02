const apiKey = '3d712f56e14e4ef995b157d6aa7bd91a';
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');

function getLastMonthDate() {
  const now = new Date();
  const lastMonth = new Date(now);
  lastMonth.setMonth(now.getMonth() - 1);
  return lastMonth.toISOString().split('T')[0];
}

function showLoading() {
  resultsDiv.innerHTML = '<p>Loading...</p>';
}

function showError(message) {
  resultsDiv.innerHTML = `<p style="color:red;">${message}</p>`;
}

function renderArticles(articles) {
  if (!articles.length) {
    resultsDiv.innerHTML = '<p>No news articles found for Wisconsin in the last month.</p>';
    return;
  }
  resultsDiv.innerHTML = articles.map(article => `
    <div class="article">
      <a href="${article.url}" target="_blank" rel="noopener">${article.title}</a>
      <div><small>${article.source.name} | ${new Date(article.publishedAt).toLocaleDateString()}</small></div>
      <div>${article.description ? article.description : ''}</div>
    </div>
  `).join('');
}

async function fetchNews() {
  showLoading();

  // Query terms for cannabis, legalization, policy, or general news
  const query = encodeURIComponent('(cannabis OR marijuana OR legalization OR policy OR weed)');
  const fromDate = getLastMonthDate();
  const toDate = new Date().toISOString().split('T')[0];
  const url = `https://newsapi.org/v2/everything?q=${query}%20AND%20Wisconsin&from=${fromDate}&to=${toDate}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      showError('Error fetching news. Please try again later.');
      return;
    }
    const data = await response.json();
    if (data.status !== 'ok') {
      showError('API error: ' + data.message);
      return;
    }
    renderArticles(data.articles);
  } catch (err) {
    showError('Network error. Please check your connection.');
  }
}

searchBtn.addEventListener('click', fetchNews);
