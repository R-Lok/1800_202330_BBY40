function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('logging out user')
        localStorage.clear()
        redirectToIndex()
    }).catch((error) => {
        // An error happened.
    })
}

const themeToggle = document.getElementById('theme')
const measurementSystemToggle = document.getElementById('system')

themeToggle.addEventListener('change', e => updateUserPreferences())
measurementSystemToggle.addEventListener('change', e => updateUserPreferences())

function updateUserPreferences() {
    const userId = localStorage.getItem('userId')
    let currentTheme = getCurrentTheme()
    let currentMeasurementSystem = getCurrentMeasurementSystem()

    db.collection('users').doc(userId).update({
        theme: currentTheme,
        measurement: currentMeasurementSystem
    })
}

function getCurrentTheme() {
    let darkToggled = localStorage.getItem('theme')

    if (darkToggled === 'true') {
        return 'dark'
    } else {
        return 'light'
    }
}

function getCurrentMeasurementSystem() {
    let imperialToggled = localStorage.getItem('system')

    if (imperialToggled === 'true') {
        return 'imperial'
    } else {
        return 'metric'
    }
}

const setToggle = (ids) => {
    for (const id of ids) {
        if (localStorage.getItem(id) === 'true' && document.getElementById(id)) {
            document.getElementById(id).checked = true
        }
    }
}

const saveToggle = (id) => {
    localStorage.setItem(id, document.getElementById(id).checked)
    applyTheme()
}

setToggle(['system', 'theme'])