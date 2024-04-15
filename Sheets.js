function doPost(e) {
    /**
     * Übertrage die Daten, die in dem Formular übermittelt in Google-Sheets
     * @type {string}
     */

    // Tabelle in der die gesamten Daten gespeichert werden sollen
    let fullSheetName = 'Shirts';
    let fullSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(fullSheetName);
    // Tabelle in der nur die Nummern gespeichert werden sollen. Diese werden benötigt, um zu überprüfen, ob die Nummer bereits vorhanden ist.
    // Dabei wird eine separate Tabelle verwendet, um die Performance bei der Abfrage der Nummern zu verbessern und Datenschutz zu gewährleisten.
    let numbersSheetName = 'Nummern'
    let numbersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(numbersSheetName);

    // Übermittelte Shirt-Nummer
    let nummer = e.parameter.nummer;

    // Überprüfen, ob die Nummer bereits vorhanden ist
    let data = numbersSheet.getRange("A:A").getValues(); // Spalte mit den Nummern auslesen
    for (let i = 0; i < data.length; i++) {
        if (data[i][0] == nummer) {
            // Nummer bereits vorhanden, daher wird ein Fehler geworfen
            throw new Error("Die Nummer ist bereits vorhanden.");
        }
    }

    // Daten in die Tabelle eintragen
    let rowData = [];
    rowData.push(new Date()); // Zeitstempel hinzufügen
    rowData.push(e.parameter.vorname); // Vorname
    rowData.push(e.parameter.nachname); // Nachname
    rowData.push(e.parameter.email); // E-Mail
    rowData.push(e.parameter.nummer); // Nummer
    rowData.push(e.parameter.groesse); // Größe
    rowData.push(e.parameter.geschlecht); // Farbe
    fullSheet.appendRow(rowData);

    // Nummer in die Nummern-Tabelle eintragen
    let numbersData = [];
    numbersData.push(e.parameter.nummer);
    numbersSheet.appendRow(numbersData);

    // Rückmeldung, dass die Daten erfolgreich hinzugefügt wurden
    return ContentService.createTextOutput("Daten erfolgreich hinzugefügt.").setMimeType(ContentService.MimeType.TEXT);
}
