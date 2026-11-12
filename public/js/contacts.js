document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contacts-form');
    let msg = document.getElementById('form-msg');

    if (!msg && form) {
        msg = document.createElement('p');
        msg.id = 'form-msg';
        msg.style.display = 'none';
        msg.style.marginTop = '15px';
        msg.style.fontWeight = 'bold';
        msg.style.textAlign = 'center';
        form.appendChild(msg);
    }

    const i18n = {
        it: {
            required: "Compila questo campo.",
            namePattern: "Inserisci almeno 2 lettere (senza numeri o simboli).",
            emailPattern: "Inserisci un indirizzo email valido (es. mario123@email.com).",
            telPattern: "Inserisci un numero di telefono valido (es. +39 340 1234567).",
            emptyForm: "Compila tutti i campi prima di inviare.",
            sending: "Invio in corso...",
            success: "Messaggio inviato con successo! Ti risponderemo al più presto.",
            error: "Errore durante l'invio. Riprova o scrivici direttamente a jessica.jdled@gmail.com."
        },
        en: {
            required: "Please fill out this field.",
            namePattern: "Please enter at least 2 letters (no numbers or symbols).",
            emailPattern: "Please enter a valid email address (e.g. mario123@email.com).",
            telPattern: "Please enter a valid phone number (e.g. +39 340 1234567).",
            emptyForm: "Please fill in all fields before sending.",
            sending: "Sending...",
            success: "Message sent successfully! We will get back to you shortly.",
            error: "Error sending message. Please try again or email jessica.jdled@gmail.com directly."
        }
    };

    function getTexts() {
        const lang = (window.JDLedI18n && window.JDLedI18n.getLang())
            || localStorage.getItem('jdled_lang')
            || (document.documentElement.lang || 'it').slice(0, 2).toLowerCase();
        return lang === 'en' ? i18n.en : i18n.it;
    }

    const inputsConfig = [
        { id: 'name', patternKey: 'namePattern' },
        { id: 'email', patternKey: 'emailPattern' },
        { id: 'tel', patternKey: 'telPattern' },
        { id: 'msg', patternKey: null }
    ];

    inputsConfig.forEach(item => {
        const el = document.getElementById(item.id);
        if (!el) return;

        el.addEventListener('invalid', function () {
            const t = getTexts();
            if (el.validity.valueMissing) {
                el.setCustomValidity(t.required);
            } else if (el.validity.patternMismatch && item.patternKey) {
                el.setCustomValidity(t[item.patternKey]);
            } else {
                el.setCustomValidity('');
            }
        });

        el.addEventListener('input', function () {
            el.setCustomValidity('');
            if (msg && msg.style.color === 'rgb(220, 53, 69)') {
                msg.style.display = 'none';
            }
        });
    });

    if (form) {
        form.addEventListener('invalid', function () {
            const t = getTexts();
            if (msg) {
                msg.textContent = t.emptyForm;
                msg.style.color = "#dc3545";
                msg.style.display = "block";
            }
        }, true);

        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Blocca il redirect esterno che lasciava la pagina in caricamento

            const t = getTexts();
            const submitBtn = form.querySelector('button[type="submit"]');
            const nome = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const telefono = document.getElementById('tel')?.value.trim() || '';
            const messaggio = document.getElementById('msg')?.value.trim() || '';

            if (!nome || !email || !telefono || !messaggio) {
                if (msg) {
                    msg.textContent = t.emptyForm;
                    msg.style.color = "#dc3545";
                    msg.style.display = "block";
                }
                return;
            }

            // Blocca il tasto durante l'invio per evitare doppi clic
            if (submitBtn) submitBtn.disabled = true;
            if (msg) {
                msg.textContent = t.sending;
                msg.style.color = "#b67b0d";
                msg.style.display = "block";
            }

            try {
                // Converte automaticamente l'action di FormSubmit nell'endpoint AJAX
                const ajaxUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
                const formData = new FormData(form);

                const response = await fetch(ajaxUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok && (result.success === "true" || result.success === true)) {
                    if (msg) {
                        msg.textContent = t.success;
                        msg.style.color = "#28a745";
                        msg.style.display = "block";
                    }
                    form.reset();
                } else {
                    throw new Error(result.message || 'Errore FormSubmit');
                }
            } catch (err) {
                console.error('Errore invio form:', err);
                if (msg) {
                    msg.textContent = t.error;
                    msg.style.color = "#dc3545";
                    msg.style.display = "block";
                }
            } finally {
                // Riabilita sempre il pulsante, sia in caso di successo che di errore
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});