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
    const currentUrl = window.location.href; // Usiamo l'URL intero, più sicuro
    const btnIt = document.getElementById('change-to-it');
    const btnEn = document.getElementById('change-to-en');

    if (!btnIt || !btnEn) return false;

    // Rimuoviamo la classe active da entrambi per sicurezza prima di iniziare
    btnIt.classList.remove('active');
    btnEn.classList.remove('active');

    if (currentUrl.includes('/en/')) {
        // --- SIAMO IN INGLESE ---
        btnEn.classList.add('active'); // Grassetto su EN
        btnEn.href = "#";
        // Il tasto IT deve portarci alla versione italiana
        btnIt.href = currentUrl.replace('/en/', '/it/');
    } else {
        // --- SIAMO IN ITALIANO (o root) ---
        btnIt.classList.add('active'); // Grassetto su IT
        btnIt.href = "#";
        // Il tasto EN deve portarci alla versione inglese
        if (currentUrl.endsWith('.app/') || currentUrl.endsWith('.app')) {
             btnEn.href = "/en/index.html";
        } else {
             btnEn.href = currentUrl.replace('/it/', '/en/');
        }
    }
    
    // Test di debug: se lo vedi in console vuol dire che ha lavorato
    console.log("Lingua impostata. URL attuale:", currentUrl);
    return true;
};