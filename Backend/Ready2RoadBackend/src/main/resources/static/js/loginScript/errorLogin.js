// Funzione per ottenere il valore di un parametro dalla query string dell'URL
function getParameterByName(name, url) {
    // Se non è specificato l'URL, si prende quello della finestra corrente
    if (!url) url = window.location.href;
    // Si effettua l'escape dei caratteri speciali
    name = name.replace(/[[]]/g, "\\$&");
    // Si crea una regex per ottenere il valore del parametro
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    // Se non viene trovato alcun valore, si restituisce null
    if (!results) return null;
    // Se non viene trovato alcun valore, si restituisce una stringa vuota
    if (!results[2]) return '';
    // Si restituisce il valore del parametro
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Funzione per mostrare un avviso in base allo stato di accesso
function showLoginAlert() {
    // Si mostra un avviso all'utente
    Swal.fire({
        title: 'Attenzione!',
        text: 'Credenziali non valide. Per favore, controlla e riprova!',
        confirmButtonText: 'Ok',
        icon: 'error',
        background: '#4d4d4d',
        color: 'white',
        confirmButtonColor: 'var(--primary-color)',
    });
}

// Verifica se il parametro 'loginStatus' è presente e mostra l'avviso di conseguenza
const loginStatus = getParameterByName('loginStatus');
if (loginStatus !== null && loginStatus === 'invalidCredentials') {
    showLoginAlert();
}