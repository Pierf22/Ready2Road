document.addEventListener('DOMContentLoaded', function() {
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
    fetch(`/setTheme?theme=${theme}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .catch(error => console.error('Error setting theme on server:', error));
}

function setTheme(theme) {
    const themeStyleLink = document.getElementById('theme-style');

    if (theme === 'dark') {
        themeStyleLink.href = 'css/darkStyle.css';
        darkTheme();
    } else {
        themeStyleLink.href = 'css/lightStyle.css';
        lightTheme();
    }

}

function darkTheme(){
    //gestisco i placeholder
    $("#password").removeClass("blackPlaceholder");
    $("#passwordRepeat").removeClass("blackPlaceholder");
    $("#password").addClass("whitePlaceholder");
    $("#passwordRepeat").addClass("whitePlaceholder");

    //setto il tema dark
    $("#loginContainer").css({
        "background-color": "var(--accent-color)",
        "color": "var(--text-color)"
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
    $("#passwordRepeat").css({
        "background-color": "var(--component-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#viewRepeat").css({
        "background-color": "var(--component-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });

}
function lightTheme(){
    //gestisco i placeholder
    $("#password").removeClass("whitePlaceholder");
    $("#passwordRepeat").removeClass("whitePlaceholder");
    $("#password").addClass("blackPlaceholder");
    $("#passwordRepeat").addClass("blackPlaceholder");

    //setto il tema light
    $("#loginContainer").css({
        "background-color": "var(--background-color)",
        "color": "var(--text-color)"
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
    $("#passwordRepeat").css({
        "background-color": "var(--background-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
    $("#viewRepeat").css({
        "background-color": "var(--background-color)",
        "color": "var(--text-color)",
        "border-color": "var(--border-color)"
    });
}