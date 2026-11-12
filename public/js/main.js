/* Funzione per includere Header e Footer nelle pagine */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
                elmnt.innerHTML = this.responseText;
                aggiornaAnno();
                evidenziaPaginaAttiva();
                if (window.JDLedI18n && window.JDLedI18n.getLang) {
                    window.JDLedI18n.setLang(window.JDLedI18n.getLang());
                }
            }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

function aggiornaAnno() {
    const spanAnno = document.getElementById("current-year");
    if (spanAnno) {
        spanAnno.innerText = new Date().getFullYear();
    }
}

function evidenziaPaginaAttiva() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#navMenu .menu a').forEach(link => {
        const linkPath = (link.getAttribute('href') || '').split('/').pop();
        if (linkPath === currentPath) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Esecuzione
document.addEventListener('DOMContentLoaded', includeHTML);

// Preloader veloce (non blocca l'LCP)
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 200);
    }
});

/* =========================================
   JDLED PROJECT LUX - COOKIE CONSENT MANAGER (GDPR)
   Integrato direttamente in main.js
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
            renderBanner();
        }
    });

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