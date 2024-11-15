window.addEventListener("load", function() {
    var butRegister = document.querySelector("#btn-register");
    butRegister.addEventListener("click", function () {
        validateFields();
    });
});

function validateFields() {
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;
    var passwordConfirm = document.querySelector("#confPassword").value;
    var nome = document.querySelector("#nome").value;
    var cognome = document.querySelector("#cognome").value;
    var telefono = document.querySelector("#tel").value;
    var dataNascita = document.querySelector("#dataNascita").value;

    var erroriPresenti = false;

    if (!validatePassword(password)) {
        document.querySelector("#password").classList.add(".errorBorder");
        document.querySelector("#passwordError").style.display = "block";
        erroriPresenti = true;
    }
    else {
        document.querySelector("#password").style.borderColor = "#DEE2E6";
        document.querySelector("#passwordError").style.display = "none";
    }

    if (!validatePasswordConfirm(password, passwordConfirm)) {
        document.querySelector("#confPassword").style.border = "1px solid red";
        document.querySelector("#confPasswordError").style.display = "block";
        erroriPresenti = true;
    }
    else {
        document.querySelector("#confPassword").style.borderColor = "#DEE2E6";
        document.querySelector("#confPasswordError").style.display = "none";
    }

    if (!validateEmail(email)) {
        document.querySelector("#email").style.border = "1px solid red";
        document.querySelector("#emailError").style.display = "block";
        erroriPresenti = true;
    }
    else {
        document.querySelector("#email").style.borderColor = "#DEE2E6";
        document.querySelector("#emailError").style.display = "none";
    }

    if (!validateTelefono(telefono)) {
        document.querySelector("#tel").style.border = "1px solid red";
        document.querySelector("#telError").style.display = "block";
        erroriPresenti = true;
    }
    else {
        document.querySelector("#tel").style.borderColor = "#DEE2E6";
        document.querySelector("#telError").style.display = "none";
    }

    if(!validateNome(nome)){
        document.querySelector("#nome").style.border = "1px solid red";
        document.querySelector("#nomeError").style.display = "block";
        erroriPresenti = true;
    }
    else {
        document.querySelector("#nome").style.borderColor = "#DEE2E6";
        document.querySelector("#nomeError").style.display = "none";
    }

    if(!validateNome(cognome)){
        document.querySelector("#cognome").style.border = "1px solid red";
        document.querySelector("#cognomeError").style.display = "block";
        erroriPresenti = true;
    }
    else {
        document.querySelector("#cognome").style.borderColor = "#DEE2E6";
        document.querySelector("#cognomeError").style.display = "none";
    }

    if(dataNascita == ""){
        document.querySelector("#dataNascita").style.border = "1px solid red";
        document.querySelector("#dataNascitaError").style.display = "block";
        erroriPresenti = true;
    }
    else {
        document.querySelector("#dataNascita").style.borderColor = "#DEE2E6";
        document.querySelector("#dataNascitaError").style.display = "none";
    }

    if(erroriPresenti){
        return;
    }

    isEmailFree(email, function (result) {
        if (result) {
            document.querySelector("#email").style.borderColor = "#DEE2E6";
            document.querySelector("#emailUnavailableError").style.display = "none";

            // Qui inserisci la logica successiva, ad esempio chiamare registerCall
            registerCall();
        } else {
            document.querySelector("#email").style.border = "1px solid red";
            document.querySelector("#emailUnavailableError").style.display = "block";
        }
    });


}

function validateEmail(email) {
    var re = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function validatePassword(password) {
    var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

function validatePasswordConfirm(password, passwordConfirm) {
    return password === passwordConfirm;
}

function validateTelefono(telefono) {
    var re = /^\d{10}$/;
    return re.test(telefono);
}

function validateNome(nome) {
    var re = /^[\p{L}' ]+$/u;
    return re.test(nome);
}


function isEmailFree(email, callback) {
    $.ajax({
        type: "POST",
        url: "/verificaEmailUserServlet",
        data: { email: email },
        success: function(response) {
            // Gestisci la risposta del server
            if (response === "disponibile") {
                callback (true);
            } else {
                callback (false);
            }
        },
        error: function(error) {
            console.error("Errore durante la richiesta AJAX: ", error);
            callback(false); // In caso di errore, considera l'email non disponibile
        }
    });
}

function registerCall(){
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;
    var nome = document.querySelector("#nome").value;
    var cognome = document.querySelector("#cognome").value;
    var telefono = document.querySelector("#tel").value;
    var dataNascita = document.querySelector("#dataNascita").value;

    var utente = {
        "indirizzoEmail": email,
        "password": password,
        "nome": nome,
        "cognome": cognome,
        "numeroTelefono": telefono,
        "dataNascita": dataNascita
    }

    var utenteJson = JSON.stringify(utente);

    $.ajax({
        url: "/registerUserServlet",
        type: "POST",
        data: utenteJson,
        contentType: "application/json",
        success: function(risposta) {
            if (risposta == "OK") {
                alert("Registrazione avvenuta con successo");
                window.location.href = "login";
            }
        }
    });
}