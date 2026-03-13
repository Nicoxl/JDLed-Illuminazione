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

// Accende il pulsante della lingua corretta nell'header
document.addEventListener("DOMContentLoaded", () => {
    // Aspettiamo mezzo secondo per dare tempo al tuo script "include-html" di caricare l'header
    setTimeout(() => {
        const currentPath = window.location.pathname;
        
        // Se siamo nella cartella /en/
        if (currentPath.includes('/en/')) {
            const btnEn = document.getElementById('lang-en');
            if (btnEn) btnEn.classList.add('active');
        } 
        // Altrimenti diamo per scontato che siamo in italiano (o nella root)
        else {
            const btnIt = document.getElementById('lang-it');
            if (btnIt) btnIt.classList.add('active');
        }
    }, 500); // 500 millisecondi di ritardo per far caricare l'HTML iniettato
});