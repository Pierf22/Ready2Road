//Questa funzione setta la password visibile, fa il cambio dell'icona e del tipo di input
$(document).ready(function() {
    $("#viewP").click(function() {
        var passwordInput = $("input[name='password']");
        var eyeIcon = $("#eye");

        // Cambia la visibilità della password
        if (passwordInput.attr("type") === "password") {
            passwordInput.attr("type", "text");
            eyeIcon.removeClass("fa-eye").addClass("fa-eye-slash");
        } else {
            passwordInput.attr("type", "password");
            eyeIcon.removeClass("fa-eye-slash").addClass("fa-eye");
        }
    });
});

$(document).ready(function() {
    $("#viewRepeat").click(function() {
        var passwordInput = $("input[name='passwordRepeat']");
        var eyeIcon = $("#eyeRepeat");

        // Cambia la visibilità della password
        if (passwordInput.attr("type") === "password") {
            passwordInput.attr("type", "text");
            eyeIcon.removeClass("fa-eye").addClass("fa-eye-slash");
        } else {
            passwordInput.attr("type", "password");
            eyeIcon.removeClass("fa-eye-slash").addClass("fa-eye");
        }
    });
});