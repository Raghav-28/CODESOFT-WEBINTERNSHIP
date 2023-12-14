const buttons = document.querySelectorAll('.buttons button');
const inputEl = document.querySelector('input');
const output = document.querySelector('#output');
const historyContainer = document.querySelector('.history');

const STORAGE_NAME = 'history_v4';

if (localStorage.getItem(STORAGE_NAME) == null) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify([]));
}

refreshHistory();

for (let button of buttons) {
    const symbol = button.innerHTML;

    button.addEventListener('pointerdown', () => {
        if (symbol == '=') {
            const historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME));
            if (!historyElements.includes(inputEl.value)) {
                historyElements.push(inputEl.value);
            }
            localStorage.setItem(STORAGE_NAME, JSON.stringify(historyElements));

            inputEl.value = output.value;
            refreshHistory();
        } else if (symbol == 'DEL') {
            inputEl.value = inputEl.value.slice(0, inputEl.value.length - 1);
        } else if (symbol == 'CLEAR') {
            inputEl.value = '';
        } else {
            inputEl.value += symbol;
        }

        registrateChange();
    });
}

inputEl.addEventListener('input', registrateChange);

function registrateChange() {
    let newValue = '';
    try {
        newValue = eval(inputEl.value) || '';
    } catch (error) {
        newValue = 'INVALID INPUT';
    }

    output.value = newValue;
}

function refreshHistory() {
    history.innerHTML = '';

    let historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME)) || [];

    for (let i = historyElements.length - 1; i >= 0; i--) {
        const div = document.createElement('div');
        div.className = 'historyItem';

        let evaluated = '';

        try {
            evaluated = eval(historyElements[i]);
        } catch (error) {
            evaluated = 'INVALID RESULT';
        }

        div.innerHTML = `
            <div>${truncate(historyElements[i], 14)}</div>
            <div>${truncate(evaluated, 14)}</div>
        `;

        history.appendChild(div);

        div.addEventListener('pointerdown', () => {
            inputEl.value = historyElements[i];
            registrateChange();
        });
    }
}

function truncate(str, length) {
    return str.length > length ? str.slice(0, length) + '...' : str;
}
