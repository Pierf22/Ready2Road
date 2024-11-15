// Esegue azioni appena il documento è stato caricato
document.addEventListener('DOMContentLoaded', function() {
    var textCElement = document.getElementById('textC');

    if (textCElement !== null) {
        textCElement.value = "";
    }
});

// Funzione per verificare il captcha
function verificaCaptcha() {
    // Ottieni il valore inserito dall'utente nel campo captcha
    var userInputCaptcha = $("input[name='captcha']").val();

    //verifico se sono nel form admin
    var url = new URL(window.location.href);
    var parametro1 = url.searchParams.get("admin");

    // Ottieni il testo del captcha attuale
    var actualCaptcha = $("#captchaText").text();
    var container = $("#textC");

    // Confronta il captcha inserito con quello attuale, se non corrispondono, lancia un alert
    if (userInputCaptcha !== actualCaptcha && userInputCaptcha !== "" && parametro1 !== "true") {
        Swal.fire({
            title: 'Attenzione!',
            text: 'Il captcha inserito è errato!',
            confirmButtonText: 'Ok',
            icon: 'error',
            background: '#4d4d4d',
            color: 'white',
            confirmButtonColor: 'var(--primary-color)',
        });
        container.val("");
        return false; // Restituisci false se la verifica fallisce
    }

    return true; // Restituisci true se la verifica è riuscita
}

// Aggiungo un ascoltatore per l'evento 'click' sul pulsante "Accedi"
$("#accediButton").on('click', function(event) {
    // Verifica il captcha prima di consentire l'invio del modulo
    if (!verificaCaptcha()) {
        event.preventDefault(); // Impedisci l'invio del modulo se la verifica fallisce
    }
});

// Aggiungo un ascoltatore per l'evento 'blur' sul campo captcha
$("input[name='captcha']").blur(function() {
    // Verifica il captcha quando si perde il focus dal campo
    verificaCaptcha();
});

// Aggiungo un ascoltatore per l'evento 'keydown' sulla pagina
$(document).on('keydown', function(event) {
    // Verifica se il tasto premuto è 'Enter'
    if (event.key === 'Enter') {
        // Verifica il captcha prima di consentire l'invio del modulo
        if (!verificaCaptcha()) {
            event.preventDefault(); // Impedisci l'invio del modulo se la verifica fallisce
        }
    }
});
