document.addEventListener("DOMContentLoaded", function() {
    const loadComponent = (selector, url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    element.outerHTML = data;
                } else {
                    console.warn(`Placeholder with selector "${selector}" not found.`);
                }
            })
            .catch(error => console.error(`Error loading component from ${url}:`, error));
    };

    const setActiveLink = () => {
        const navLinks = document.querySelectorAll('.main-nav a');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            
            if (currentPath === 'index.html' && (linkPath === 'index.html' || linkPath === '')) {
                link.classList.add('active');
            } else if (linkPath && linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    };

    const setupStickyHeader = () => {
        const header = document.querySelector('.main-header');
        let lastScrollTop = 0;
        
        if (header) {
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                lastScrollTop = scrollTop;
            }, { passive: true });
        }
    };

    const fixMobileSticky = () => {
        if ('ontouchstart' in window) {
            document.body.style.height = '100.1%';
            setTimeout(() => {
                document.body.style.height = '100%';
            }, 500);
        }
    };

    Promise.all([
        loadComponent("#header-placeholder", "layout/header.html"),
        loadComponent("#footer-placeholder", "layout/footer.html")
    ]).then(() => {
        setActiveLink();
        setupStickyHeader();
        fixMobileSticky();
    });
});