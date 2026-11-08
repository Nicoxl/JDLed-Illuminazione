document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contacts-form');
    let msg = document.getElementById('form-msg');

    // Se l'elemento per il messaggio non esiste già nel DOM, lo crea sotto il form
    if (!msg && form) {
        msg = document.createElement('p');
        msg.id = 'form-msg';
        msg.style.display = 'none';
        msg.style.marginTop = '15px';
        msg.style.fontWeight = 'bold';
        msg.style.textAlign = 'center';
        form.parentNode.appendChild(msg);
    }

    // Rileva la lingua (dall'attributo lang di <html>, dall'URL o dalle impostazioni del browser)
    const htmlLang = (document.documentElement.lang || '').toLowerCase();
    const isEn = htmlLang.startsWith('en') || window.location.pathname.includes('/en/');

    const i18n = {
        it: {
            required: "Compila questo campo.",
            namePattern: "Inserisci almeno 2 lettere (senza numeri o simboli).",
            emailPattern: "Inserisci un indirizzo email valido (es. mario123@email.com).",
            telPattern: "Inserisci un numero di telefono valido (es. +39 340 1234567).",
            emptyForm: "Compila tutti i campi prima di inviare.",
            sending: "Invio in corso...",
            success: "Messaggio inviato con successo!"
        },
        en: {
            required: "Please fill out this field.",
            namePattern: "Please enter at least 2 letters (no numbers or symbols).",
            emailPattern: "Please enter a valid email address (e.g. mario123@email.com).",
            telPattern: "Please enter a valid phone number (e.g. +39 340 1234567).",
            emptyForm: "Please fill in all fields before sending.",
            sending: "Sending...",
            success: "Message sent successfully!"
        }
    };

    const t = isEn ? i18n.en : i18n.it;

    // Configurazione dei messaggi di validazione nativa dei browser
    const inputsConfig = [
        { id: 'name', patternMsg: t.namePattern },
        { id: 'email', patternMsg: t.emailPattern },
        { id: 'tel', patternMsg: t.telPattern },
        { id: 'msg', patternMsg: null }
    ];

    inputsConfig.forEach(item => {
        const el = document.getElementById(item.id);
        if (!el) return;

        el.addEventListener('invalid', function () {
            if (el.validity.valueMissing) {
                el.setCustomValidity(t.required);
            } else if (el.validity.patternMismatch && item.patternMsg) {
                el.setCustomValidity(item.patternMsg);
            } else {
                el.setCustomValidity('');
            }
        });

        el.addEventListener('input', function () {
            el.setCustomValidity('');
        });
    });

    // Mostra il messaggio di successo se presente il flag in localStorage dopo il redirect
    if (localStorage.getItem("formInviato") === "true" && msg) {
        msg.textContent = t.success;
        msg.style.color = "#28a745";
        msg.style.display = "block";
        localStorage.removeItem("formInviato");
    }

    // Gestione invio e validazione form
    if (form) {
        form.addEventListener('submit', function (e) {
            const nome = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('tel').value.trim();
            const messaggio = document.getElementById('msg').value.trim();

            if (!nome || !email || !telefono || !messaggio) {
                e.preventDefault();
                if (msg) {
                    msg.textContent = t.emptyForm;
                    msg.style.color = "#dc3545";
                    msg.style.display = "block";
                }
            } else {
                localStorage.setItem("formInviato", "true");
                if (msg) {
                    msg.textContent = t.sending;
                    msg.style.color = "#b67b0d";
                    msg.style.display = "block";
                }
            }
        });
    }
});