const delayedRedirectToIndex = () => setTimeout(() => logout(), 5000)

const logout = () => {
    firebase.auth().signOut().then(() => {
        localStorage.clear()
        window.location.href = './index.html'
    }).catch((error) => {
        console.log(error)
    })
}

delayedRedirectToIndex()
