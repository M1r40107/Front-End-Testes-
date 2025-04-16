document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const sunIcon = '☀️';
    const moonIcon = '🌙';
    let currentPage = 1;
    const newsPerPage = 10;
    let allNews = [];
    const themeKey = 'theme';

    // Função para definir o tema
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleButton.textContent = sunIcon;
            localStorage.setItem(themeKey, 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            themeToggleButton.textContent = moonIcon;
            localStorage.setItem(themeKey, 'light');
        }
    }

    // Função para alternar o tema
    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    // Função para carregar o tema salvo
    function loadTheme() {
        const savedTheme = localStorage.getItem(themeKey);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    // Função para buscar notícias
    async function fetchNews(page) {
        if (page === 1) {
            newsContainer.innerHTML = '<div class="loading">Carregando notícias...</div>';
        }
        try {
            const apiUrl = `https://api.example.com/tecnologia?page=${page}&limit=${newsPerPage}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.articles && data.articles.length > 0) {
                allNews = allNews.concat(data.articles);
                displayNews(allNews.slice(0, page * newsPerPage));
                if (data.totalResults <= allNews.length) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'block';
                }
            } else if (page === 1) {
                newsContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
            newsContainer.innerHTML = '<p>Erro ao carregar as notícias.</p>';
            loadMoreBtn.style.display = 'none';
        }
    }

    // Função para exibir as notícias
    function displayNews(news) {
        newsContainer.innerHTML = '';
        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <h3>${item.title || 'Título não disponível'}</h3>
                <p>${item.description || 'Descrição não disponível'}</p>
                ${item.url ? `<p><a href="${item.url}" target="_blank">Leia mais</a></p>` : ''}
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    // Evento de clique no botão de carregar mais notícias
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        fetchNews(currentPage);
    });

    // Evento de clique no botão para alternar tema
    themeToggleButton.addEventListener('click', toggleTheme);

    // Carrega o tema no carregamento da página
    loadTheme();

    // Carrega as notícias da primeira página
    fetchNews(currentPage);
});
