function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('logging out user')
        localStorage.clear()
        window.location.href = './goodbye.html'
    }).catch((error) => {
        console.log(error)
        // An error happened.
    })
}

const lists = ['system', 'theme']

for (const list of lists) {
    document.getElementById(list).addEventListener('change', () => updateUserPreferences())
}

function updateUserPreferences() {
    db.collection('users').doc(localStorage.getItem('userId')).update({
        theme: localStorage.getItem('theme'),
        measurement: localStorage.getItem('system'),
    })
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

setToggle(lists)
