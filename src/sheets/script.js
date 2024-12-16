/**
  * This script is used to handle the form data and write it to the Google Sheets.
  * The form data is sent via POST request.
  *
  * The form is available at: https://wsg-wunstorf.de/scw
/**

/**
* Verify that the form is complete by checking if all required fields are filled.
* If a required field is empty, an error is thrown.
*
* @param {Object} params - The parameters of the form
* @throws {Error} - If a required field is empty
*/
function verifyCompleteForm(params) {
    const wrongInputError = new Error('Das Formular hat einen falschen Input übermittelt.');

    for (let param in params) {
        if (params[param] === null || params[param] === '') {
            throw incompleteFormError;
        }
    }
}

/**
* Handle the form data for the shirts.
* The data is written to the 'Shirts' table in the Google Sheets.
*
* @param {Object} e - The form data
* @throws {Error} - If the shirt number is already used or the form is incomplete
* @returns {ContentService} - The response to the user
*/
function handleShirt(e) {
    const params = {
        firstName: e.parameter.vorname,
        lastName: e.parameter.nachname,
        email: e.parameter.email,
        amount: e.parameter.anzahl,
        size: e.parameter.groesse,
        shirtNumber: e.parameter.nummer,
        gender: e.parameter.geschlecht,
        imprint: e.parameter.aufdruck === null || e.parameter.aufdruck === '' ? e.parameter.nachname : e.parameter.aufdruck,
    }

    verifyCompleteForm(params);

    // Definieren der Tabellen
    let fullSheetName = 'Shirts'; // Name der Tabelle, in die die Daten eingetragen werden sollen
    let numbersSheetName = 'Nummern' // Name der Tabelle, in die die Nummern eingetragen werden sollen
    let fullSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(fullSheetName); // Tabelle mit den Daten
    let numbersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(numbersSheetName); // Tabelle mit den Nummern

    // Nummer aus dem Formular auslesen
    let nummer = params.shirtNumber;

    // Überprüfen, ob die Nummer bereits vorhanden ist
    let data = numbersSheet.getRange('A:A').getValues(); // Spalte mit den Nummern auslesen
    for (let i = 0; i < data.length; i++) {
        if (data[i][0].toString() === nummer.toString()) {
            // Nummer wird bereits verwendet
            // Fehlermeldung zurückgeben
            throw new Error("Die Nummer ist bereits vorhanden.");
        }
    }

    // Daten in die Tabelle einfügen
    let rowData = [];

    // Zeitstempel hinzufügen
    rowData.push(new Date());

    // Daten aus dem Formular hinzufügen
    rowData.push(params.firstName); // Vorname
    rowData.push(params.lastName); // Nachname
    rowData.push(params.email); // E-Mail Adresse
    rowData.push(params.shirtNumber); // Trikotnummer
    rowData.push(params.size); // Größe des Shirts
    rowData.push(params.gender); // Geschlecht
    rowData.push(params.imprint); // Aufdruck
    rowData.push(params.amount); // Anzahl der Shirts

    // Daten in die Tabelle einfügen
    fullSheet.appendRow(rowData);

    // Nummer in die Nummern-Tabelle einfügen
    let numbersData = [];
    // Nummer hinzufügen
    numbersData.push(params.shirtNumber);
    // Nummer in Tabelle einfügen
    numbersSheet.appendRow(numbersData);

    // Rückmeldung an den Nutzer
    return ContentService.createTextOutput("Daten erfolgreich hinzugefügt.").setMimeType(ContentService.MimeType.TEXT);
}

/**
* Handle the form data for the caps.
* The data is written to the 'Caps' table in the Google Sheets.
*
* @param {Object} e - The form data
* @throws {Error} - If the form is incomplete
* @returns {ContentService} - The response to the user
*/
function handleCap(e) {
    const params = {
        firstName: e.parameter.vorname,
        lastName: e.parameter.nachname,
        email: e.parameter.email,
        amount: e.parameter.anzahl,
        size: e.parameter.groesse,
        typeCap: e.parameter.badekappe,
        imprint: e.parameter.aufdruck === null || e.parameter.aufdruck === '' ? e.parameter.nachname : e.parameter.aufdruck,
    }

    verifyCompleteForm(params);

    // Definieren der Tabellen
    let fullSheetName = 'Badekappen'; // Name der Tabelle, in die die Daten eingetragen werden sollen
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(fullSheetName); // Tabelle mit den Daten

    // Daten in die Tabelle einfügen
    let rowData = [];

    // Zeitstempel hinzufügen
    rowData.push(new Date());

    // Daten aus dem Formular hinzufügen
    rowData.push(params.firstName); // Vorname
    rowData.push(params.lastName); // Nachname
    rowData.push(params.email); // E-Mail Adresse
    rowData.push(params.typeCap); // Art der Badekappe
    rowData.push(params.size); // Größe der Badekappe
    rowData.push(params.amount); // Anzahl der Badekappen
    rowData.push(params.imprint); // Aufdruck

    // Daten in die Tabelle einfügen
    sheet.appendRow(rowData);

    // Rückmeldung an den Nutzer
    return ContentService.createTextOutput("Daten erfolgreich hinzugefügt.").setMimeType(ContentService.MimeType.TEXT);
}

/**
* Handle the form data for the shorts.
* The data is written to the 'Shorts' table in the Google Sheets.
*
* @param {Object} e - The form data
* @throws {Error} - If the form is incomplete
* @returns {ContentService} - The response to the user
*/
function handleShorts(e) {
    const params = {
        firstName: e.parameter.vorname,
        lastName: e.parameter.nachname,
        email: e.parameter.email,
        amount: e.parameter.anzahl,
        size: e.parameter.groesse,
    }

    verifyCompleteForm(params);

    // Definieren der Tabellen
    let fullSheetName = 'Hosen'; // Name der Tabelle, in die die Daten eingetragen werden sollen
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(fullSheetName); // Tabelle mit den Daten

    // Daten in die Tabelle einfügen
    let rowData = [];

    // Zeitstempel hinzufügen
    rowData.push(new Date());

    // Daten aus dem Formular hinzufügen
    rowData.push(params.firstName); // Vorname
    rowData.push(params.lastName); // Nachname
    rowData.push(params.email); // E-Mail Adresse
    rowData.push(params.size); // Größe der Badekappe
    rowData.push(params.amount); // Anzahl der Badekappen

    // Daten in die Tabelle einfügen
    sheet.appendRow(rowData);

    // Rückmeldung an den Nutzer
    return ContentService.createTextOutput("Daten erfolgreich hinzugefügt.").setMimeType(ContentService.MimeType.TEXT);
}

/**
* Entry point for the POST request.
* The type of form is determined and the corresponding handler is called.
*
* @param {Object} e - The form data
* @returns {ContentService} - The response to the user
*/
function doPost(e) {
    const type = e.parameter.bestellung;

    if (type === 'badekappe') {
        return handleCap(e);
    } else if (type === 'shirt') {
        return handleShirt(e);
    } else if (type === 'hose') {
        return handleShorts(e);
    } else {
        throw new Error('Das Formular wurde nicht vollständig ausgefüllt.');
    }
}

/** Entry point for the GET request.
* Uses URL parameters to determine the response.
*
* @param {Object} e - The request object
* @returns {ContentService} - The response to the user
*/
function doGet(e) {
    if (e.parameter.type) {
        if (e.parameter.type === 'numbers') {
            let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Shirts');
            let data = sheet.getRange('E:E').getValues();
            let numbers = data.map(row => row[0]).filter(value => !isNaN(value));
            return ContentService.createTextOutput(numbers.join(',')).setMimeType(ContentService.MimeType.TEXT);
        }
        return ContentService.createTextOutput("Unknown type.");
    }
    return ContentService.createTextOutput("No type specified.");
}
