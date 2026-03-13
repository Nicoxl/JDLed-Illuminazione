/* Funzione per includere Header e Footer nelle pagine*/
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
          }
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      }
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

// Esecuzione
document.addEventListener('DOMContentLoaded', includeHTML);

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Aggiunge la classe che fa partire la dissolvenza
        preloader.classList.add('loaded');
      
        // Rimuove fisicamente l'elemento dopo la transizione
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

const setupLanguageSwitcher = () => {
    const btnIt = document.getElementById('change-to-it');
    const btnEn = document.getElementById('change-to-en');
    const currentPath = window.location.pathname;

    if (!btnIt || !btnEn) return false;

    // 1. Reset classi
    btnIt.classList.remove('active');
    btnEn.classList.remove('active');

    // 2. Logica per Inglese
    if (currentPath.includes('/en/')) {
        btnEn.classList.add('active');
        // Il tasto IT deve portarti alla stessa pagina in /it/
        btnIt.href = currentPath.replace('/en/', '/it/');
        // Il tasto EN lo lasciamo cliccabile sulla home inglese o #
        btnEn.href = "/en/index.html"; 
    } 
    // 3. Logica per Italiano
    else {
        btnIt.classList.add('active');
        // Il tasto EN deve portarti alla stessa pagina in /en/
        if (currentPath === "/" || currentPath.includes("index.html")) {
            btnEn.href = "/en/index.html";
        } else {
            btnEn.href = currentPath.replace('/it/', '/en/');
        }
        btnIt.href = "/it/index.html";
    }
    return true;
};

// Avvio con controllo ripetuto (per via dell'include-html)
const startLangCheck = () => {
    let attempts = 0;
    const interval = setInterval(() => {
        const done = setupLanguageSwitcher();
        attempts++;
        if (done || attempts > 50) clearInterval(interval);
    }, 100);
};

document.addEventListener("DOMContentLoaded", startLangCheck);