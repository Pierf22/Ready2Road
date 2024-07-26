document.addEventListener('DOMContentLoaded', function() {
    // questo metodo è chiamato quando la pagina è completamente caricata, verifico se c'è un tema salvato sul server sennò setto quello di default del browser
    const themeStyleLink = document.getElementById('theme-style');

    fetch('/getTheme', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const currentTheme = data.theme;
            if (currentTheme === 'null') {
                if (window.matchMedia) {
                    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                        themeStyleLink.href = 'css/lightStyle.css';
                        lightTheme();
                    } else {
                        themeStyleLink.href = 'css/darkStyle.css';
                        darkTheme();
                    }
                } else {
                    lightTheme();
                }
            } else {
                setTheme(currentTheme);
            }
        })
        .catch(error => console.error('Error fetching theme:', error));
});

$(document).ready(function() {
    // questo metodo è chiamato quando la pagina è completamente caricata, setta il tema in base a quello salvato sul server
    const themeStyleLink = document.getElementById('theme-style');

    $("#darkTheme").click(function() {
        themeStyleLink.href = 'css/darkStyle.css';
        darkTheme();
        setThemeOnServer('dark');
    });

    $("#lightTheme").click(function() {
        themeStyleLink.href = 'css/lightStyle.css';
        lightTheme();
        setThemeOnServer('light');
    });
});

function setThemeOnServer(theme) {
    // questo metodo è chiamato quando si clicca su un tema, e invia una richiesta al server per impostare il tema
    fetch(`/setTheme?theme=${theme}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .catch(error => console.error('Error setting theme on server:', error));
}

function setTheme(theme) {
    // questo metodo è chiamato quando si carica la pagina, e imposta il tema in base a quello salvato sul server
    const themeStyleLink = document.getElementById('theme-style');

    if (theme === 'dark') {
        themeStyleLink.href = 'css/darkStyle.css';
        darkTheme();
    } else {
        themeStyleLink.href = 'css/lightStyle.css';
        lightTheme();
    }

}

function darkTheme() {
    //setta il tema dark
    btnAcceso = $("#lightTheme");
    btnSpento = $("#darkTheme");

    btnAcceso.removeClass("acceso");
    btnAcceso.addClass("spento");
    btnSpento.removeClass("spento");
    btnSpento.addClass("acceso");

    //gestisco i placeholder
    $("#email").removeClass("blackPlaceholder");
    $("#username").removeClass("blackPlaceholder");
    $("#password").removeClass("blackPlaceholder");
    $("#textC").removeClass("blackPlaceholder");
    $("#email").addClass("whitePlaceholder");
    $("#username").addClass("whitePlaceholder");
    $("#password").addClass("whitePlaceholder");
    $("#textC").addClass("whitePlaceholder");

    //setto il tema dark
    $("#loginContainer").css({
        "background-color": "var(--accent-color)",
        "color": "var(--text-color)"
    });
    $("#captchaText").css({
        "color": "var(--text-color)",
        "background-image": "linear-gradient(to right, #d3d3d3 2px, transparent 2px), linear-gradient(to bottom, #d3d3d3 2px, transparent 2px)"
    });
    $("#captchaContainer").css({"background-color": "var(--captcha-color)"});
    $("#email").css({
        "background-color": "var(--component-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#username").css({
        "background-color": "var(--component-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#password").css({
        "background-color": "var(--component-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#viewP").css({
        "background-color": "var(--component-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#textC").css({
        "background-color": "var(--component-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
}
function lightTheme(){
    //setta il tema light
    btnAcceso = $("#darkTheme");
    btnSpento = $("#lightTheme");

    btnAcceso.removeClass("acceso");
    btnAcceso.addClass("spento");
    btnSpento.removeClass("spento");
    btnSpento.addClass("acceso");

    //gestisco i placeholder
    $("#email").removeClass("whitePlaceholder");
    $("#username").removeClass("whitePlaceholder");
    $("#password").removeClass("whitePlaceholder");
    $("#textC").removeClass("whitePlaceholder");
    $("#email").addClass("blackPlaceholder");
    $("#username").addClass("blackPlaceholder");
    $("#password").addClass("blackPlaceholder");
    $("#textC").addClass("blackPlaceholder");

    //setto il tema light
    $("#loginContainer").css({
        "background-color": "var(--background-color)",
        "color": "var(--text-color)"
    });
    $("#email").css({
        "background-color": "var(--background-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#username").css({
        "background-color": "var(--background-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#password").css({
        "background-color": "var(--background-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#viewP").css({
        "background-color": "var(--background-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#textC").css({
        "background-color": "var(--background-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#captchaText").css({
        "color": "#202528",
        "background-image": "linear-gradient(to right, #555 2px, transparent 2px), linear-gradient(to bottom, #555 2px, transparent 2px)"
    });
    $("#captchaContainer").css({"background-color": "va(--captcha-color)"});
}