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

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});