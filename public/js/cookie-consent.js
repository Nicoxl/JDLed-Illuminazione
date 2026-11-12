/* =========================================
   JDLED PROJECT LUX - COOKIE CONSENT MANAGER (GDPR)
   ========================================= */

(function () {
    const GA_ID = 'G-V0NZSTZY12';
    const CONSENT_KEY = 'jdled_cookie_consent';
    let gaLoaded = false;

    const texts = {
        it: {
            title: 'Informativa sui Cookie',
            desc: 'Utilizziamo cookie tecnici necessari al funzionamento del sito e, solo con il tuo consenso, cookie analitici (Google Analytics) per migliorare l’esperienza di navigazione. Per saperne di più consulta la ',
            policyLink: 'Cookie Policy',
            accept: 'Accetta tutti',
            reject: 'Rifiuta non necessari',
            closeAria: 'Chiudi e rifiuta cookie non necessari'
        },
        en: {
            title: 'Cookie Notice',
            desc: 'We use strictly necessary technical cookies for the website to function and, only with your consent, analytical cookies (Google Analytics) to improve your browsing experience. Learn more in our ',
            policyLink: 'Cookie Policy',
            accept: 'Accept all',
            reject: 'Reject non-essential',
            closeAria: 'Close and reject non-essential cookies'
        }
    };

    function getCurrentLang() {
        const lang = (window.JDLedI18n && window.JDLedI18n.getLang())
            || localStorage.getItem('jdled_lang')
            || (document.documentElement.lang || 'it').slice(0, 2).toLowerCase();
        return lang === 'en' ? 'en' : 'it';
    }

    // Carica Google Analytics SOLO dopo consenso esplicito
    function loadGoogleAnalytics() {
        if (gaLoaded) return;
        gaLoaded = true;

        window['ga-disable-' + GA_ID] = false;
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;

        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        script.async = true;
        document.head.appendChild(script);

        gtag('js', new Date());
        gtag('config', GA_ID, { anonymize_ip: true });
    }

    // Disabilita GA e rimuove i cookie analitici in caso di rifiuto/revoca
    function disableGoogleAnalytics() {
        window['ga-disable-' + GA_ID] = true;
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const name = cookie.split('=')[0].trim();
            if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
        }
    }

    function renderBanner() {
        // Rimuove eventuale banner già aperto (es. cambio lingua o riapertura)
        const existing = document.getElementById('jdled-cookie-banner');
        if (existing) existing.remove();

        const t = texts[getCurrentLang()];

        const banner = document.createElement('div');
        banner.id = 'jdled-cookie-banner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', t.title);

        banner.innerHTML = `
            <div class="cookie-banner-inner">
                <button type="button" class="cookie-close-x" id="cookie-close-x" aria-label="${t.closeAria}">&times;</button>
                <div class="cookie-banner-text">
                    <h4>${t.title}</h4>
                    <p>${t.desc}<a href="/cookie-policy.html">${t.policyLink}</a>.</p>
                </div>
                <div class="cookie-banner-actions">
                    <button type="button" class="cookie-btn cookie-btn-reject" id="cookie-reject">${t.reject}</button>
                    <button type="button" class="cookie-btn cookie-btn-accept" id="cookie-accept">${t.accept}</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('cookie-accept').addEventListener('click', () => {
            localStorage.setItem(CONSENT_KEY, 'accepted');
            banner.remove();
            loadGoogleAnalytics();
        });

        const rejectHandler = () => {
            localStorage.setItem(CONSENT_KEY, 'rejected');
            banner.remove();
            disableGoogleAnalytics();
        };

        document.getElementById('cookie-reject').addEventListener('click', rejectHandler);
        document.getElementById('cookie-close-x').addEventListener('click', rejectHandler);
    }

    // Espone la funzione globale per riaprire il banner dal footer o dalla Cookie Policy
    window.openCookiePreferences = function () {
        renderBanner();
    };

    document.addEventListener('DOMContentLoaded', () => {
        const savedConsent = localStorage.getItem(CONSENT_KEY);

        if (savedConsent === 'accepted') {
            loadGoogleAnalytics();
        } else if (savedConsent === 'rejected') {
            disableGoogleAnalytics();
        } else {
            // Nessuna scelta ancora salvata: mostra il banner
            renderBanner();
        }
    });

    // Se l'utente cambia lingua mentre il banner è visibile, aggiorna i testi del banner
    document.addEventListener('click', (e) => {
        if (e.target.closest('#change-to-it') || e.target.closest('#change-to-en')) {
            setTimeout(() => {
                if (document.getElementById('jdled-cookie-banner')) {
                    renderBanner();
                }
            }, 50);
        }
    });
})();