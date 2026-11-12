/* =========================================
   JDLED PROJECT LUX - SISTEMA BILINGUE VELOCE (i18n.js)
   ========================================= */

(function () {
    const SUPPORTED_LANGS = ['it', 'en'];
    const DEFAULT_LANG = 'it';
    const STORAGE_KEY = 'jdled_lang';

    let currentLang = DEFAULT_LANG;
    let translations = {};
    let isApplying = false;

    function detectInitialLang() {
        const urlParams = new URLSearchParams(window.location.search);
        const paramLang = urlParams.get('lang');
        if (paramLang && SUPPORTED_LANGS.includes(paramLang.toLowerCase())) {
            return paramLang.toLowerCase();
        }

        const savedLang = localStorage.getItem(STORAGE_KEY);
        if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
            return savedLang;
        }

        const browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
        return browserLang === 'it' ? 'it' : 'en';
    }

    function getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
    }

    function applyTranslations(root = document) {
        if (!translations || Object.keys(translations).length === 0 || isApplying) return;
        isApplying = true;

        try {
            document.documentElement.lang = currentLang;

            root.querySelectorAll('[data-i18n]').forEach(el => {
                const val = getNestedValue(translations, el.getAttribute('data-i18n'));
                if (val !== null && el.textContent !== val) el.textContent = val;
            });

            root.querySelectorAll('[data-i18n-html]').forEach(el => {
                const val = getNestedValue(translations, el.getAttribute('data-i18n-html'));
                if (val !== null && el.innerHTML !== val) el.innerHTML = val;
            });

            root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const val = getNestedValue(translations, el.getAttribute('data-i18n-placeholder'));
                if (val !== null) el.setAttribute('placeholder', val);
            });

            root.querySelectorAll('[data-i18n-title]').forEach(el => {
                const val = getNestedValue(translations, el.getAttribute('data-i18n-title'));
                if (val !== null) el.setAttribute('title', val);
            });

            root.querySelectorAll('[data-i18n-download]').forEach(el => {
                const val = getNestedValue(translations, el.getAttribute('data-i18n-download'));
                if (val !== null) {
                    const fileUrl = el.getAttribute('data-file-url');
                    el.setAttribute('onclick', `DownloadWithFilename('${fileUrl}', '${val}')`);
                }
            });

            const pageTitleKey = document.body ? document.body.getAttribute('data-i18n-page-title') : null;
            if (pageTitleKey) {
                const pageTitle = getNestedValue(translations, pageTitleKey);
                if (pageTitle !== null) document.title = pageTitle;
            }

            const btnIt = document.getElementById('change-to-it');
            const btnEn = document.getElementById('change-to-en');
            if (btnIt) btnIt.classList.toggle('active', currentLang === 'it');
            if (btnEn) btnEn.classList.toggle('active', currentLang === 'en');
        } finally {
            isApplying = false;
        }
    }

    async function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);

        // Se è già in sessionStorage, applica subito senza fare fetch
        const cached = sessionStorage.getItem(`jdled_dict_${lang}`);
        if (cached) {
            translations = JSON.parse(cached);
            applyTranslations();
            return;
        }

        try {
            const response = await fetch(`/lang/${lang}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            translations = await response.json();
            sessionStorage.setItem(`jdled_dict_${lang}`, JSON.stringify(translations));
            applyTranslations();
        } catch (err) {
            console.error('Errore nel caricamento della lingua:', err);
        }
    }

    window.JDLedI18n = {
        getLang: () => currentLang,
        setLang: (lang) => setLanguage(lang),
        t: (key) => getNestedValue(translations, key)
    };

    document.addEventListener('click', (e) => {
        const btnIt = e.target.closest('#change-to-it');
        const btnEn = e.target.closest('#change-to-en');
        if (btnIt) {
            e.preventDefault();
            if (currentLang !== 'it') setLanguage('it');
        } else if (btnEn) {
            e.preventDefault();
            if (currentLang !== 'en') setLanguage('en');
        }
    });

    // Osserva SOLO i contenitori include-html (header e footer) e poi si disconnette
    function watchIncludes() {
        const includeTargets = document.querySelectorAll('[include-html]');
        includeTargets.forEach(target => {
            const obs = new MutationObserver(() => {
                applyTranslations(target);
                obs.disconnect(); // Smette subito di osservare una volta caricato!
            });
            obs.observe(target, { childList: true });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        watchIncludes();
        setLanguage(detectInitialLang());
    });
})();