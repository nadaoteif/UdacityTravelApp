import { updateUI } from "./updateUI";


const dateInput = document.getElementById('date')
window.addEventListener('load', (event) => {
dateInput.addEventListener('focus', e => {
    e.preventDefault();
    // sets input to today's date
    let dateControl = document.querySelector('input[type="date"]');
    dateControl.setAttribute('min', today());
    dateControl.setAttribute('max', '2025-01-01')
    dateControl.value = today();
})
});

function dateCountdown(dateInput) {
    let d1 = new Date(dateInput.replace(/\-/g, '/'));
    let d2 = new Date(today().replace(/\-/g, '/'));
    // calculates from milliseconds to days
    const difference = (d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24).toFixed(0);
    if (difference > 1) {
        return `${difference} Days! Be Ready!`
    } 
    else if (difference === 1) {
        return `${difference} Day! Be Ready!`
    } 
    else if (difference === 0) {
        return `Today! Are You Ready?`
    } 
    else {
        return `Expired, You Missed your Trip!`
    }
}

function today() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today
}

async function submitForm(input) {
    const response = await fetch('/makeCalls', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'same-origin',
        body: JSON.stringify(input)
    });
    return response.json()
}
window.addEventListener('load', (event) => {
const submitBtn = document.getElementById('submit')
submitBtn.addEventListener('click', e => {
    validateForm(e)
})
});

function validateForm(e) {
    e.preventDefault();
    const cityInput = document.getElementById('city').value;
    const dateInput = document.getElementById('date').value;
    const userInput = { city: cityInput, date: dateInput }
    cityInput === '' || dateInput === '' ? alert('Please Enter destination & date!') : submitForm(userInput)
        .then(data => {
            // response to send to UI
            updateUI(data)
        })
}
export { 
    dateInput,
    dateCountdown,
    today,
    submitForm,
    validateForm
}

