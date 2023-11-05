function redirectUser() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location.href = './main.html'
        } else {
            console.log('not logged in.')
        }
    })
}
redirectUser()
