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

const handleLanguageLinks = () => {
    const currentPath = window.location.pathname;
    const btnIt = document.getElementById('change-to-it');
    const btnEn = document.getElementById('change-to-en');

    // Se i pulsanti non sono ancora nel DOM, usciamo e riproveremo
    if (!btnIt || !btnEn) return false;

    // Caso 1: Siamo in Inglese
    if (currentPath.includes('/en/')) {
        btnEn.classList.add('active');
        btnEn.href = "#";
        btnIt.href = currentPath.replace('/en/', '/it/');
    } 
    // Caso 2: Siamo in Italiano (cartella /it/ o root "/")
    else {
        btnIt.classList.add('active');
        btnIt.href = "#";
        // Se siamo nella root, il link EN deve andare esplicitamente a /en/
        if (currentPath === "/" || currentPath === "/index.html") {
            btnEn.href = "/en/index.html";
        } else {
            btnEn.href = currentPath.replace('/it/', '/en/');
        }
    }
    return true;
};

// Funzione che controlla finché l'header non è caricato
const initLangSwitcher = () => {
    const attempts = setInterval(() => {
        const success = handleLanguageLinks();
        if (success) clearInterval(attempts); // Se ha funzionato, ferma i tentativi
    }, 100); // Controlla ogni 100ms

    // Ferma i tentativi comunque dopo 3 secondi per non pesare sulla memoria
    setTimeout(() => clearInterval(attempts), 3000);
};

document.addEventListener("DOMContentLoaded", initLangSwitcher);