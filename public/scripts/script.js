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

function toggleDarkMode() {
    const element = document.body
    element.classList.toggle('dark-mode')
}
