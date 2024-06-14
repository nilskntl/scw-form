const incompleteFormError = new Error('Das Formular wurde nicht vollständig ausgefüllt.');
const wrongInputError = new Error('Das Formular hat einen falschen Input übermittelt.');

function handleShirt(required, requiredShirt, e) {
    for (let param in requiredShirt) {
        if (requiredShirt[param] === null || requiredShirt[param] === '') {
            throw incompleteFormError;
        }
    }
    // Definieren der Tabellen
    let fullSheetName = 'Shirts'; // Name der Tabelle, in die die Daten eingetragen werden sollen
    let numbersSheetName = 'Nummern' // Name der Tabelle, in die die Nummern eingetragen werden sollen
    let fullSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(fullSheetName); // Tabelle mit den Daten
    let numbersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(numbersSheetName); // Tabelle mit den Nummern

    // Nummer aus dem Formular auslesen
    let nummer = requiredShirt.number;

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
    rowData.push(required.firstName); // Vorname
    rowData.push(required.lastName); // Nachname
    rowData.push(required.email); // E-Mail Adresse
    rowData.push(requiredShirt.shirtNumber); // Trikotnummer
    rowData.push(requiredShirt.size); // Größe des Shirts
    rowData.push(requiredShirt.gender); // Geschlecht

    // Überprüfen, ob ein Aufdruck angegeben wurde
    if (e.parameter.aufdruck === null || e.parameter.aufdruck === '') {
        rowData.push(required.nachname); // Standardaufdruck
    } else {
        rowData.push(e.parameter.aufdruck); // Wenn ein Aufdruck angegeben wurde, diesen verwenden
    }

    rowData.push(required.anzahl); // Anzahl der Shirts

    // Daten in die Tabelle einfügen
    fullSheet.appendRow(rowData);

    // Nummer in die Nummern-Tabelle einfügen
    let numbersData = [];
    // Nummer hinzufügen
    numbersData.push(requiredShirt.nummer);
    // Nummer in Tabelle einfügen
    numbersSheet.appendRow(numbersData);

    // Rückmeldung an den Nutzer
    return ContentService.createTextOutput("Daten erfolgreich hinzugefügt.").setMimeType(ContentService.MimeType.TEXT);
}

function handleCap(required, requiredCap, e) {
    for (let param in requiredCap) {
        if (requiredCap[param] === null || requiredCap[param] === '') {
            throw incompleteFormError;
        }
    }
    // Definieren der Tabellen
    let fullSheetName = 'Badekappen'; // Name der Tabelle, in die die Daten eingetragen werden sollen
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(fullSheetName); // Tabelle mit den Daten

    // Daten in die Tabelle einfügen
    let rowData = [];

    // Zeitstempel hinzufügen
    rowData.push(new Date());

    // Daten aus dem Formular hinzufügen
    rowData.push(required.firstName); // Vorname
    rowData.push(required.lastName); // Nachname
    rowData.push(required.email); // E-Mail Adresse
    rowData.push(requiredCap.typeCap); // Art der Badekappe
    rowData.push(required.size); // Größe der Badekappe
    rowData.push(required.amount); // Anzahl der Badekappen

    // Daten in die Tabelle einfügen
    sheet.appendRow(rowData);

    // Rückmeldung an den Nutzer
    return ContentService.createTextOutput("Daten erfolgreich hinzugefügt.").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {

    const required = {
        type: e.parameter.bestellung,
        firstName: e.parameter.vorname,
        lastName: e.parameter.nachname,
        email: e.parameter.email,
        amount: e.parameter.anzahl,
        size: e.parameter.groesse,
    }

    const requiredShirt = {
        shirtNumber: e.parameter.nummer,
        gender: e.parameter.geschlecht,
    }

    const requiredCap = {
        typeCap: e.parameter.badekappe,
    }

    for (let param in required) {
        if (required[param] === null || required[param] === '') {
            throw incompleteFormError;
        }
    }
    if (required.type === 'badekappe') {
        return handleCap(required, requiredCap, e);
    } else if (required.type === 'shirt') {
        return handleShirt(required, requiredShirt, e);
    } else {
        throw wrongInputError;
    }
}
