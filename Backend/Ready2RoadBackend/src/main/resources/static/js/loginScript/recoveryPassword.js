async function recoveryPassword() {
    //alert per il recupero della password, chiede prima l'email, poi invia una mail con il link per il recupero
    const { value: email } = await Swal.fire({
        title: "Indirizzo Email",
        html: "<div style='text-align: justify'>Inserisci l'indirizzo email con il quale ti sei registrato al sito. <br><br> <span style='color: #ED2647; font-weight: bold;'>Nota</span>: apri l'email dallo stesso browser in cui hai avviato la procedura di recupero.</div>",
        input: "email",
        inputPlaceholder: "yourEmail@example.com",
        showCancelButton: true,
        cancelButtonText: 'Annulla',
        confirmButtonColor: 'var(--primary-color)',
        cancelButtonColor: 'var(--primary-color)',
        confirmButtonText: 'Invia',
        background: '#4d4d4d',
        color: 'white',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async (email) => {
            if (email) {
                Swal.showLoading();
                try {
                    const response = await $.ajax({
                        type: 'POST',
                        url: 'sendEmail',
                        data: { email: email }
                    });

                    Swal.close();
                    Swal.fire({
                        title: 'Successo!',
                        text: 'Email inviata correttamente, controlla la tua casella di posta elettronica!',
                        confirmButtonText: 'Ok',
                        icon: 'success',
                        background: '#4d4d4d',
                        color: 'white',
                        confirmButtonColor: 'var(--primary-color)',
                    });
                } catch (error) {
                    Swal.close();
                    Swal.fire({
                        title: 'Attenzione!',
                        text: 'Email non inviata, si prega di riprovare!',
                        confirmButtonText: 'Ok',
                        icon: 'error',
                        background: '#4d4d4d',
                        color: 'white',
                        confirmButtonColor: 'var(--primary-color)',
                    });
                }
            }
        }
    });
}
