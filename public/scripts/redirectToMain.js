function redirectToMain() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location.href = './main.html'
        }
    })
}

redirectToMain()
