# ✈️ Ready2Road ✈️
La biglietteria permette di acquistare biglietti di autobus, treni, aerei. Sono previste 3 tipologie di utenti:
1. Utente:
   <ul>
	   <li>Può acquistare un biglietto andata/ritorno o solo andata per uno dei mezzi presenti nel servizio.</li>
	   <li>Può consultare la mappa aggiornata in tempo reale per tracciare voli, treni e autobus partendo dall'id della tratta.</li>
	   <li>Può modificare le sue informazioni nell'area personale.</li>
	   <li>Può convertire i suoi punti acquisto in un buono dal valore casuale che può usare nel sito per ottenere uno sconto sull'acquisto dei biglietti.</li>
	   <li>Può aggiungere nuovi metodi di pagamento, visualizzare il suo saldo attuale, visualizzare i suoi buoni e visualizzare le sue ultime transazioni effettuate sul sito
          attraverso la pagina "Portafoglio".</li>
	   <li>Può comunicare attraverso un servizio di chat con il servizio tenico.</li>
   </ul>

2. Amministratore:
   <ul>
	   <li>Può visualizzare le statistiche sull'andamento del sito web.</li>
	   <li>Può modificare/cancellare utenti/biglietti/percorsi.</li>
	   <li>Può bannare utenti e venditori.</li>
	   <li>Può rispondere attraverso il servizio di chat con gli utenti che richiedono supporto.</li>
	   <li>Può consultare la mappa aggiornata in tempo reale per tracciare voli, treni e autobus partendo dall'id della tratta.</li>
   </ul>
   
3. Venditore:
   <ul>
	   <li>Può iscriversi al sito come venditore e può mettere in vendita i biglietti della propria società 
	scegliendo giorni e orari.</li>
	   <li>Può applicare sconti ai suoi biglietti caricati scegliendo numero di biglietti da mettere in sconto e percentuale dello sconto.</li>
	   <li>Può comunicare con gli utenti attraverso un servizio di chat.</li>
	   <li>Può visualizzare una statistiche delle proprie vendite attraverso diversi grafici.</li>
	   <li>Può consultare la mappa aggiornata in tempo reale per tracciare voli, treni e autobus partendo dall'id della tratta.</li>
   </ul>

• <strong>NOTA</strong>: per accedere come amministratore e sufficiente effettuare il login al sito con le seguenti credenziali:
	<ul>
 		<li>Username: user</li>
   		<li>Password: user</li>
 	</ul>

# 💾 Database 💾
<h2>Progettazione Concettuale</h2>

![Modello ER](https://github.com/matte18it/Ready2Road/blob/main/ModelloERReady2Road.drawio.png)

<h2>Progettazione Logica</h2>

- admin (<ins>username</ins>, cognome, nome, password)
- utente (<ins>indirizzo_e-mail</ins>, cognome, nome, data_nascita, password, numero_telefono, ban,  \*id_wallet)
- venditore (<ins>nome_società</ins>, password, indirizzo_e-mail, ban,  \*id_wallet)
- wallet (<ins>id</ins>, saldo, punti_acquisto)
- metodo_di_pagamento (<ins>nome</ins>, \*wallet)
- buono (<ins><codice, \*nome></ins>, valore)
- carta_di_pagamento (<ins><numero, \*nome></ins>, cvc, data_di_scadenza)
- conto_corrente (<ins><iban, \*nome></ins>, banca)
- transazione (<ins>id</ins>, valore, data_ora, \*metodo_pagamento, \*wallet)
- biglietto_transazione(<ins><\*id_transazione, \*numero_biglietto></ins>)
- biglietto (<ins>numero</ins>, posto, prezzo, data_ora_acquisto, scadenza, nome, cognome, cf, \*utente, \*tratta)
- tratta (<ins>id</ins>, partenza, destinazione, tipo_mezzo, capienza, data_ora, posti_disponibili, prezzo, sconto, numero_biglietti_scontati,  \*nome_venditore)
- tappa(<ins>\*tratta</ins>, citta1, citta2, citta3, citta4, citta5, citta6, citta7, citta8, citta9, citta10)
- conversazione(<ins>nome</ins>, \*username_admin , \*email_utente, \*nome_venditore)
- messaggio(<ins>id</ins>, testo, mittente, data, \*conversazione)

<h4>Vincoli sui dati</h4>
1. Vincolo di unicità sulla chiave indirizzo_e-mail dell’entità Venditore.<br>
2. L’attributo posti_disponibili di tratta viene aumentato di uno se viene eliminato un biglietto.<br>
3. L’attributo posti_disponibili di tratta viene diminuito di uno alla generazione di un biglietto con tratta=tratta.id.
  
# ❗️DISCLAIMER❗️
Questo progetto è stato sviluppato come parte del corso "Web Applications" presso il Dipartimento di Matematica e Informatica (DeMaCS) dell'Università della Calabria. Essendo un lavoro universitario, potrebbe contenere qualche errore o imprecisione. Accogliamo con piacere qualsiasi feedback e suggerimento per migliorare! Il progetto è stato sviluppato dagli studenti:
<ul>
  <li>Matteo Canino</li>
  <li>Pierfrancesco Napoli</li>
  <li>Fortunato Andrea Gagliardi</li>
  <li>Francesco Morrone</li>
</ul>
