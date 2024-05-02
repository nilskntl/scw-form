function doPost(e) {
    // Definieren der Tabellen
    let fullSheetName = 'Shirts'; // Name der Tabelle, in die die Daten eingetragen werden sollen
    let numbersSheetName = 'Nummern' // Name der Tabelle, in die die Nummern eingetragen werden sollen
    let fullSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(fullSheetName); // Tabelle mit den Daten
    let numbersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(numbersSheetName); // Tabelle mit den Nummern

    // Nummer aus dem Formular auslesen
    let nummer = e.parameter.nummer;

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
    rowData.push(e.parameter.vorname); // Vorname
    rowData.push(e.parameter.nachname); // Nachname
    rowData.push(e.parameter.email); // E-Mail Adresse
    rowData.push(e.parameter.nummer); // Trikotnummer
    rowData.push(e.parameter.groesse); // Größe des Shirts
    rowData.push(e.parameter.geschlecht); // Geschlecht

    // Überprüfen, ob ein Aufdruck angegeben wurde
    if (e.parameter.aufdruck === null || e.parameter.aufdruck === '') {
        rowData.push(e.parameter.nachname); // Standardaufdruck
    } else {
        rowData.push(e.parameter.aufdruck); // Wenn ein Aufdruck angegeben wurde, diesen verwenden
    }

    rowData.push(e.parameter.anzahl); // Anzahl der Shirts

    // Daten in die Tabelle einfügen
    fullSheet.appendRow(rowData);

    // Nummer in die Nummern-Tabelle einfügen
    let numbersData = [];
    // Nummer hinzufügen
    numbersData.push(e.parameter.nummer);
    // Nummer in Tabelle einfügen
    numbersSheet.appendRow(numbersData);

    // Rückmeldung an den Nutzer
    return ContentService.createTextOutput("Daten erfolgreich hinzugefügt.").setMimeType(ContentService.MimeType.TEXT);
}
