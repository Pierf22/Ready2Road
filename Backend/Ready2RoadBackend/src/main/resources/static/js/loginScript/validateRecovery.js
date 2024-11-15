function validateRecoveryPassword(email){
    //qua gestisco la validazione della password e la chiamata ajax per cambiare la password
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("passwordRepeat").value;

    if((password !== "" && confirmPassword !== "") && validatePassword(password) && validatePasswordConfirm(password, confirmPassword)){
        changePassword(password, email);
    }
    else{
        Swal.fire({
            title: 'Attenzione!',
            html: 'Le password non coincidono o non rispettano i criteri di sicurezza richiesti, si prega di riprovare!<br><br> <span style=\'color: #ED2647; font-weight: bold;\'>Nota</span>: la password deve contenere almeno 8 caratteri di cui almeno uno minuscolo, uno maiuscolo, un numero e un carattere speciale (@$!%*?&).',
            confirmButtonText: 'Ok',
            icon: 'error',
            background: '#4d4d4d',
            color: 'white',
            confirmButtonColor: 'var(--primary-color)',
        });
    }

}

// metodo per validare la password
function validatePassword(password) {
    var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

// metodo per validare la conferma della password, verifico che la password sia uguale a quella inserita nel campo di conferma
function validatePasswordConfirm(password, passwordConfirm) {
    return password === passwordConfirm;
}

// metodo per cambiare la password tramite chiamata ajax con jquery
async function changePassword(password, email){
    const response = await $.ajax({
        type: 'GET',
        url: 'updatePassword',
        data: {
            email: email,
            password: password
        }
    });

    if(response === "success"){
        Swal.fire({
            title: 'Successo!',
            text: 'Password modificata correttamente!',
            confirmButtonText: 'Ok',
            icon: 'success',
            background: '#4d4d4d',
            color: 'white',
            confirmButtonColor: 'var(--primary-color)',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/login";
            }
        });
    }
    else{
        Swal.fire({
            title: 'Attenzione!',
            text: 'Password non modificata, si prega di riprovare!',
            confirmButtonText: 'Ok',
            icon: 'error',
            background: '#4d4d4d',
            color: 'white',
            confirmButtonColor: 'var(--primary-color)',
        });
    }
}