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

const saveTheme = (theme) => {
    localStorage.setItem('theme', theme)
    applyTheme()
}

const applyTheme = () => {
    if (localStorage.getItem('theme') === 'light') {
        document.head.appendChild(document.createElement('style')).innerHTML = `body > div {background-color: var(--main-color4);color: var(--main-color5);}`
    } else {
        document.head.appendChild(document.createElement('style')).innerHTML = `body > div {background-color: var(--main-color5);color: var(--main-color4);}`
    }
}

applyTheme()
