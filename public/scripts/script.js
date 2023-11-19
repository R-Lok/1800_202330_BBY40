function checkIfLoggedIn() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            redirectToIndex()
        }
    })
}

function redirectToIndex() {
    window.location.href = './index.html'
}

const applyTheme = () => {
    if (localStorage.getItem('theme') === 'false') {
        document.getElementById('main_css').href = './styles/style.css'
    } else {
        document.getElementById('main_css').href = './styles/dark_mode.css'
    }
}

checkIfLoggedIn()
applyTheme()