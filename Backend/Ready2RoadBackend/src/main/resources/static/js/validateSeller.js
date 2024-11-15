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

    var erroriPresenti = false;

    if (!validatePassword(password)) {
        document.querySelector("#password").style.border = "1px solid red";
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

    if(!validateNome(nome)){
        document.querySelector("#nome").style.border = "1px solid red";
        document.querySelector("#nomeError").style.display = "block";
        erroriPresenti = true;
    }
    else {
        document.querySelector("#nome").style.borderColor = "#DEE2E6";
        document.querySelector("#nomeError").style.display = "none";
    }

    if(erroriPresenti){
        return;
    }


    checkNameAndEmail(nome, email).then(([isNameFreeResult, isEmailFreeResult]) => {
        // Gestisci i risultati
        if (isNameFreeResult) {
            document.querySelector("#nome").style.borderColor = "#DEE2E6";
            document.querySelector("#nomeUnavailableError").style.display = "none";
        } else {
            document.querySelector("#nome").style.border = "1px solid red";
            document.querySelector("#nomeUnavailableError").style.display = "block";
            erroriPresenti = true;
        }

        if (isEmailFreeResult) {
            document.querySelector("#email").style.borderColor = "#DEE2E6";
            document.querySelector("#emailUnavailableError").style.display = "none";
        } else {
            document.querySelector("#email").style.border = "1px solid red";
            document.querySelector("#emailUnavailableError").style.display = "block";
            erroriPresenti = true;
        }

        // Prosegui con la tua logica dopo le chiamate AJAX
        if (!erroriPresenti) {
            registerCall();
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

function validateNome(nome) {
    var re = /^[\p{L}' ]+$/u;
    return re.test(nome);
}
function checkNameAndEmail(nome, email) {
    return Promise.all([
        isNameFree(nome),
        isEmailFree(email)
    ]);
}

function isNameFree(name) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "/verificaNomeSellerServlet",
            data: { name: name },
            success: function(response) {
                if (response === "disponibile") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            error: function(error) {
                console.error("Errore durante la richiesta AJAX: ", error);
                resolve(false); // In caso di errore, considera il nome non disponibile
            }
        });
    });
}

function isEmailFree(email) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "/verificaEmailSellerServlet",
            data: { email: email },
            success: function(response) {
                if (response === "disponibile") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            error: function(error) {
                console.error("Errore durante la richiesta AJAX: ", error);
                resolve(false); // In caso di errore, considera l'email non disponibile
            }
        });
    });
}

function registerCall(){    //da cambiare completamente
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;
    var nome = document.querySelector("#nome").value;

    var venditore = {
        "indirizzoEmail": email,
        "password": password,
        "nomeSocieta": nome,
    }

    var venditoreJson = JSON.stringify(venditore);

    $.ajax({
        url: "/registerSellerServlet",
        type: "POST",
        data: venditoreJson,
        contentType: "application/json",
        success: function(risposta) {
            if (risposta == "OK") {
                alert("Registrazione avvenuta con successo");
                window.location.href = "login";
            }
        }
    });
}