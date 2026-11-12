/* =========================================
   JDLED PROJECT LUX - SISTEMA BILINGUE (i18n.js)
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

    function updateSwitcherUI() {
        const btnIt = document.getElementById('change-to-it');
        const btnEn = document.getElementById('change-to-en');
        if (btnIt) {
            const isIt = currentLang === 'it';
            btnIt.classList.toggle('active', isIt);
            btnIt.setAttribute('data-lang-active', isIt ? 'true' : 'false');
        }
        if (btnEn) {
            const isEn = currentLang === 'en';
            btnEn.classList.toggle('active', isEn);
            btnEn.setAttribute('data-lang-active', isEn ? 'true' : 'false');
        }
    }

   function applyTranslations(root = document) {
        updateSwitcherUI();

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

            const metaDescKey = document.body ? document.body.getAttribute('data-i18n-meta-desc') : null;
            if (metaDescKey) {
                const metaDescVal = getNestedValue(translations, metaDescKey);
                const metaTag = document.querySelector('meta[name="description"]');
                if (metaDescVal !== null && metaTag) {
                    metaTag.setAttribute('content', metaDescVal);
                }
            }
        } finally {
            isApplying = false;
            updateSwitcherUI();
        }
    }

    async function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        updateSwitcherUI();

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

    // Riallinea traduzioni e selettore IT/EN appena header.html o footer.html vengono inseriti
    function watchIncludes() {
        document.querySelectorAll('[include-html]').forEach(target => {
            if (target.children.length > 0) {
                applyTranslations(target);
                return;
            }
            const obs = new MutationObserver(() => {
                if (target.children.length > 0) {
                    applyTranslations(target);
                    obs.disconnect();
                }
            });
            obs.observe(target, { childList: true });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        currentLang = detectInitialLang();
        watchIncludes();
        setLanguage(currentLang);
    });
})();