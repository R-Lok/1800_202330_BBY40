function sayHello() {

}
// sayHello();

let login = false
const loginFunction = () => {
    console.log(login)
    login = true
    console.log(login)
    alert('redirecting...')
    return window.location.href = 'http://localhost:3000/main.html'
}

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('logging out user')
        redirectToIndex();
    }).catch((error) => {
        // An error happened.
    })
}

// logout()

function redirectToIndex() {
    window.location.href = "./index.html"
}