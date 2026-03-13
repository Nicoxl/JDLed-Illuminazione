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

document.addEventListener("DOMContentLoaded", () => {
    // Aspettiamo che l'header venga caricato dallo script include-html
    setTimeout(() => {
        const currentPath = window.location.pathname;
        const btnIt = document.getElementById('change-to-it');
        const btnEn = document.getElementById('change-to-en');

        if (currentPath.includes('/it/')) {
            // Siamo in italiano, il tasto EN deve portarci alla stessa pagina ma in /en/
            if (btnEn) btnEn.href = currentPath.replace('/it/', '/en/');
            if (btnIt) {
                btnIt.href = "#"; 
                btnIt.classList.add('active');
            }
        } else if (currentPath.includes('/en/')) {
            // Siamo in inglese, il tasto IT deve portarci alla stessa pagina ma in /it/
            if (btnIt) btnIt.href = currentPath.replace('/en/', '/it/');
            if (btnEn) {
                btnEn.href = "#";
                btnEn.classList.add('active');
            }
        }
    }, 600); 
});