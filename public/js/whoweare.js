// Funzione per scaricare un file con un nome specifico
    function DownloadWithFilename(EffectiveUrlFile, EffectiveNomeFile) {
    // 1. Inserisci il percorso del file. DEVE puntare a un file .pdf reale
    const urlFile = EffectiveUrlFile; 
    // 2. Inserisci il nome che vuoi dare al file scaricato
    const nomeFile = EffectiveNomeFile;
    fetch(urlFile)
        .then(response => {
            // CONTROLLO DI SICUREZZA: Il file esiste?
            if (!response.ok) {
                throw new Error("Errore " + response.status + ": Il file non è stato trovato a questo indirizzo.");
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = nomeFile;
            
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
            console.error('Errore:', error);
            // Questo pop-up ti avvisa se il percorso inserito è sbagliato!
            alert("Impossibile scaricare: verifica che il percorso del file sia corretto.");
        });
    }