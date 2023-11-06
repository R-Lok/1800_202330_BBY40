function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('logging out user')
        redirectToIndex()
    }).catch((error) => {
        // An error happened.
    })
}

function redirectToIndex() {
    window.location.href = './index.html'
}

const setToggle = (id) => {
    if (localStorage.getItem(id) === 'true') {
        document.getElementById(id).checked = true
    }
}

const saveTheme = () => {
    const theme = document.getElementById('theme').checked
    localStorage.setItem('theme', theme)
    applyTheme()
}

const applyTheme = () => {
    if (localStorage.getItem('theme') === 'false') {
        document.getElementById('main_css').href = './styles/style.css'
    } else {
        document.getElementById('main_css').href = './styles/dark_mode.css'
    }
}

setToggle('theme')
applyTheme()
