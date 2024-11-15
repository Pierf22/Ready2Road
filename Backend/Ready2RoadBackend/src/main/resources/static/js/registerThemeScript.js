document.addEventListener('DOMContentLoaded', function() {
    const themeStyleLink = document.getElementById('theme-switch-btn');

    fetch('/getTheme', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const currentTheme = data.theme;
            if (currentTheme === 'null') {
                if (window.matchMedia) {
                    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                        themeStyleLink.href = 'css/lightStyle.css';
                        setSunIcon();
                        console.log("settato da 1")
                    } else {
                        themeStyleLink.href = 'css/darkStyle.css';
                        setMoonIcon()
                        console.log("settato da 2")
                    }
                } else {
                    setSunIcon()
                    console.log("settato da 3")
                }
            } else {
                setTheme(currentTheme);
                console.log("settato da 4")
            }
        })
        .catch(error => console.error('Error fetching theme:', error));
});

$(document).ready(function() {
    const themeStyleLink = document.getElementById('theme-style');

    $("#theme-switch-btn").click(function() {
        if (themeStyleLink.href.includes("css/darkStyle.css")) {
            themeStyleLink.href = 'css/lightStyle.css';
            setSunIcon()
            setThemeOnServer('light');
        } else {
            themeStyleLink.href = 'css/darkStyle.css';
            setMoonIcon()
            setThemeOnServer('dark');
        }

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
        setMoonIcon()
    } else {
        themeStyleLink.href = 'css/lightStyle.css';
        setSunIcon()
    }

}

function setSunIcon() {
    const icon = document.querySelector('#theme-switch-btn i');
    if (icon) {
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
    }
}

function setMoonIcon() {
    const icon = document.querySelector('#theme-switch-btn i');
    if (icon) {
        icon.classList.remove('bi-sun-fill');
        icon.classList.add('bi-moon-fill');
    }
}