(function () {
    function initLangSwitcher() {
        const linkIt = document.getElementById('change-to-it');
        const linkEn = document.getElementById('change-to-en');

        // Se l'header non è ancora stato caricato, esce e aspetta
        if (!linkIt && !linkEn) return false;

        const path = window.location.pathname;
        const searchAndHash = window.location.search + window.location.hash;
        const htmlLang = (document.documentElement.lang || '').toLowerCase();

        const isEn = htmlLang.startsWith('en') || path.includes('/en/');

        let pathIt = path;
        let pathEn = path;

        if (path.includes('/en/')) {
            pathIt = path.replace('/en/', '/it/');
        } else if (path.includes('/it/')) {
            pathEn = path.replace('/it/', '/en/');
        } else {
            const fileName = path.endsWith('/') ? 'index.html' : path.split('/').pop();
            pathIt = `/it/${fileName}`;
            pathEn = `/en/${fileName}`;
        }

        if (linkIt) {
            linkIt.href = pathIt + searchAndHash;
            linkIt.classList.toggle('active', !isEn);
        }

        if (linkEn) {
            linkEn.href = pathEn + searchAndHash;
            linkEn.classList.toggle('active', isEn);
        }

        return true;
    }

    // Prova subito (se l'header è già presente)
    if (initLangSwitcher()) return;

    // Altrimenti osserva il DOM finché lo script che carica header.html non lo inserisce
    const observer = new MutationObserver(function () {
        if (initLangSwitcher()) {
            observer.disconnect(); // Smette di osservare appena ha finito
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();