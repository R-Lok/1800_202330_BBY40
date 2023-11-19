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

function redirectToIndex() {
    window.location.href = './index.html'
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

const applyTheme = () => {
    if (localStorage.getItem('theme') === 'false') {
        document.getElementById('main_css').href = './styles/style.css'
    } else {
        document.getElementById('main_css').href = './styles/dark_mode.css'
    }
}

setToggle(['system', 'theme'])
applyTheme()
