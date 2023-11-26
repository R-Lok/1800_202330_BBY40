function checkIfLoggedIn() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = './index.html'
        }
    })
}

checkIfLoggedIn()
