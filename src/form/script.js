function init() {
     /**
     * Initiate all functions
     */
    createSelector();
    createShirtListener();
    createCapListener();
    createShortsListener();
    addImageGalerie();
    fetchUsedNumbers();
}

function sendForm(formData) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzGpOFPFpeEKYx2iMu01wn4LcSaWQpRegxU-GFhUZRMZcAVDg1pndFPQJ_l4g3lapXXzg/exec';

    let formDataKeys = Array.from(formData.keys());
    let formDataValues = Array.from(formData.values());

    console.log('Formulardaten:', formDataKeys.map((key, index) => `${key}: ${formDataValues[index]}`).join(', '));

    let xhr = new XMLHttpRequest(); // XMLHttpRequest-Objekt
    let loadingDiv = document.getElementById('loading-circle'); // Ladekreis
    let successMessageDiv = document.getElementById('successMessage'); // Erfolgsmeldung
    let errorMessageDiv = document.getElementById('errorMessage'); // Fehlermeldung
    let formContent = document.getElementById('form-content'); // Formular Content
    let formContainer = document.getElementById('form-container'); // Container

    // Setze die Höhe des Containers auf die gespeicherte Höhe, um ein Zusammenziehen zu verhindern
    formContainer.style.height = formContainer.offsetHeight + 'px';

    loadingDiv.style.display = 'block'; // Ladekreis anzeigen
    successMessageDiv.style.display = 'none'; // Erfolgsmeldung ausblenden
    errorMessageDiv.style.display = 'none'; // Fehlermeldung ausblenden
    formContent.style.display = 'none'; // Formular ausblenden

    // Sende die Daten an das Google-Script
    xhr.open('POST', scriptUrl, true);
    // Während des Ladevorgangs
    xhr.onload = function () {
        loadingDiv.style.display = 'none'; // Ladekreis ausblenden
        if (xhr.status >= 200 && xhr.status < 300) {
            successMessageDiv.style.display = 'block'; // Erfolgsmeldung anzeigen
            console.log('Formular erfolgreich übermittelt.'); // Logge die erfolgreiche Übermittlung
        } else {
            errorMessageDiv.style.display = 'block'; // Fehlermeldung anzeigen
            console.error('Fehler beim Übermitteln des Formulars.'); // Logge den Fehler
        }
    };
    // Bei einem Fehler
    xhr.onerror = function () {
        loadingDiv.style.display = 'none'; // Ladekreis ausblenden
        errorMessageDiv.style.display = 'block'; // Fehlermeldung anzeigen
        errorMessageDiv.innerText = 'Fehler beim Senden des Formulars. Bitte versuche es erneut.'; // Fehlermeldung setzen
        console.error('Fehler beim Senden des Formulars. Bitte versuche es erneut.'); // Logge den Fehler
    };
    xhr.send(formData);
}

function createShirtListener() {
    document.getElementById('form-shirt').addEventListener('submit', function (event) {
        /**
         * Event-Listener für den Senden-Button
         * @type {HTMLElement | *}
         */
        event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seitenwechsel)

        let formData = new FormData(this); // Formular-Eingaben

        formData.set('bestellung', 'shirt');

        // Überprüfe, ob die Nummer verfügbar ist
        let nummerInput = document.getElementById('nummer');
        let nummer = nummerInput.value.trim();
        if (formData.get('bestellung') === 'shirt' && checkNumberAvailability(nummer)) {
            // Färbe die Border des Nummernfeldes rot
            nummerInput.style.border = '2px solid var(--primary-color)';
            return;
        }

        sendForm(formData);
    });

    document.getElementById('nummer').addEventListener('input', function () {
        /**
         * Event-Listener für die Eingabe in das Nummern-Feld
         * Überprüfe dauerhaft, ob die Nummer verfügbar oder nicht verfügbar ist
         * @type {HTMLElement | *}
         */

        let numberInput = this; // Input Element
        let numberStatus = document.getElementById('number-status'); // Span-Element für den Status
        let availableNumbers = document.getElementById('available-numbers'); // Span-Element für die verfügbaren Nummern
        let number = numberInput.value.trim(); // Eingegebene Nummer

        // Wenn keine Nummer eingegeben wurde, zeige gar nichts an
        if (number === '') {
            numberStatus.innerHTML = ''; // Setze den Inhalt auf nichts
            availableNumbers.style.display = 'none'; // Blende die verfügbaren Nummern aus
            return;
        }

        if (checkNumberAvailability(number)) {
            numberStatus.innerHTML = '&#10007;'; // Zeige ein Kreuz an, um zu zeigen, dass die Nummer nicht verfügbar ist
            numberInput.classList.add('error'); // Füge die Klasse 'error' hinzu
            numberStatus.style.color = 'var(--primary-color)'; // Setze die Farbe auf Rot
            availableNumbers.style.display = 'block'; // Blende die verfügbaren Nummern ein
        } else {
            numberStatus.innerHTML = '&#10003;'; // Zeige einen Haken an, um zu zeigen, dass die Nummer verfügbar ist
            numberInput.classList.remove('error'); // Entferne die Klasse 'error'
            numberStatus.style.color = 'var(--success-color)'; // Setze die Farbe auf Grün
            numberInput.style.border = '1px solid var(--grey-color)'; // Setze die Borderfarbe zurück auf Grau
            availableNumbers.style.display = 'none'; // Blende die verfügbaren Nummern aus
            document.getElementById('errorMessage').style.display = 'none'; // Fehlermeldung ausblenden
        }
    });
}

function createCapListener() {
    document.getElementById('form-cap').addEventListener('submit', function (event) {
        /**
         * Event-Listener für den Senden-Button
         * @type {HTMLElement | *}
         */
        event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seitenwechsel)

        let formData = new FormData(this); // Formular-Eingaben

        formData.set('bestellung', 'badekappe');

        sendForm(formData);
    });


    const capSelect = document.getElementById('cap-model');
    const capSizeSelect = document.getElementById('cap-size');

    const capOptions = {
        "Moulded Pro II": [
            {value: 'Einheitsgröße', text: 'Einheitsgröße'}
        ],
        "3D Soft": [
            {value: 'M', text: 'M'},
            {value: 'L', text: 'L'}
        ],
    };

    capSelect.addEventListener('change', function () {
        const selectedCap = capSelect.value;

        while (capSizeSelect.options.length > 1) {
            capSizeSelect.options.remove(1);
        }

        if (selectedCap) {
            const options = capOptions[selectedCap];

            // Füge neue Optionen hinzu
            options.forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.text;
                capSizeSelect.appendChild(newOption);
            });
            capSizeSelect.options[0].selected = true;
            capSizeSelect.disabled = false;
        } else {
            capSizeSelect.disabled = true;
        }
    });
}

function createShortsListener() {
    const price = 31;
    const shortsPriceValue = document.getElementById('shorts-price-value');
    const shortsAmountSelector = document.getElementById('shorts-amount');

    document.getElementById('form-shorts').addEventListener('submit', function (event) {
        /**
         * Event-Listener für den Senden-Button
         * @type {HTMLElement | *}
         */
        event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seitenwechsel)

        let formData = new FormData(this); // Formular-Eingaben

        formData.set('bestellung', 'hose');

        sendForm(formData);
    });


    shortsAmountSelector.addEventListener('change', function () {
            const selectedAmount = shortsAmountSelector.value;

            if (selectedAmount) {
                shortsPriceValue.textContent = selectedAmount * price + '€';
            }
        });

}

function createSelector() {
    const selectTypeItems = document.querySelectorAll('.form-select-type__item');

    const formShirt = document.getElementById('form-shirt');
    const formShorts = document.getElementById('form-shorts');
    const formCaps = document.getElementById('form-cap');

    selectTypeItems.forEach((selectTypeItem) => {
        // Add a click event listener to each select type item
        selectTypeItem.addEventListener('click', () => {
            // If the class "form-select-type__item-selected" is not present in the current select type item
            // then remove the class from all select type items and add it to the current select type item
            if (!selectTypeItem.classList.contains('form-select-type__item-selected')) {
                selectTypeItems.forEach((item) => {
                    item.classList.remove('form-select-type__item-selected');
                });
                if (selectTypeItem.id.endsWith('shirt')) {
                    type = 'shirt';
                } else if (selectTypeItem.id.endsWith('cap')) {
                    type = 'cap';
                } else {
                    type = 'shorts';
                }

                if (type === 'cap') {
                    formShirt.style.display = 'none';
                    formShorts.style.display = 'none';
                    formCaps.style.display = 'block';
                } else if (type === "shirt") {
                    formShirt.style.display = 'block';
                    formShorts.style.display = 'none';
                    formCaps.style.display = 'none';
                } else if (type === "shorts") {
                    formShirt.style.display = 'none';
                    formShorts.style.display = 'block';
                    formCaps.style.display = 'none';
                } else {
                    formShirt.style.display = 'none';
                    formShorts.style.display = 'none';
                    formCaps.style.display = 'none';
                }

                selectTypeItem.classList.add('form-select-type__item-selected');
            }
        });
    });
}

/**
 * Überprüft, ob die eingegebene Nummer bereits verwendet wurde oder nicht und ob es sich um eine
 * legitime Nummer handelt
 * @param number die eingegebene Nummer
 */
function checkNumberAvailability(number) {
    return !(!isNaN(number) && number.toString().length <= 2 && !usedNumbers.includes(number) && !number.startsWith('0') && parseInt(number) > 0 && parseInt(number) < 100);
}

/**
 * Lädt die bisher verwendeten Nummern aus einer Google-Tabelle
 */
function fetchUsedNumbers() {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzGpOFPFpeEKYx2iMu01wn4LcSaWQpRegxU-GFhUZRMZcAVDg1pndFPQJ_l4g3lapXXzg/exec?type=numbers';

    let xhr = new XMLHttpRequest(); // XMLHttpRequest-Objekt
    xhr.open('GET', scriptUrl, true); // GET-Anfrage an das Google-Script senden

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            usedNumbers = xhr.responseText.split(','); // Split the response by comma to get the numbers
            updateAvailableNumbers(); // Update the available numbers
        } else {
            console.error('Fehler beim Laden der Nummern. Statuscode: ' + xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error('Netzwerkfehler beim Laden der Nummern.');
    };

    xhr.send();
}

function updateAvailableNumbers() {
    /**
     * Aktualisiert die verfügbaren Nummern
     */
    let availableNumbersSpan = document.getElementById('available-numbers-span');
    let availableNumbers = [];
    for (let i = 1; i <= 99; i++) {
        if (!usedNumbers.includes(i.toString())) {
            availableNumbers.push(i);
        }
    }
    availableNumbersSpan.textContent = 'Verfügbare Nummern: ' + availableNumbers.join(', ');
}

function addImageGalerie() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const closeBtn = document.querySelector('.close-btn');

    // Add click event to each gallery image
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            fullscreenImg.src = img.src;
            fullscreenOverlay.style.display = 'flex';
        });
    });

    // Close fullscreen when clicking close button
    closeBtn.addEventListener('click', () => {
        fullscreenOverlay.style.display = 'none';
    });

    // Close fullscreen when clicking outside the image
    fullscreenOverlay.addEventListener('click', (e) => {
        if (e.target === fullscreenOverlay) {
            fullscreenOverlay.style.display = 'none';
        }
    });
}

let usedNumbers = [];
init();