function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) { // if the pointer to "user" object is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log($('#navplaceholder').load('./text/navbar.html'))
            console.log($('#footerplaceholder').load('./text/footer.html'))
        } else {
            // No user is signed in.
            console.log($('#navplaceholder').load('./text/navbar.html'))
            console.log($('#footerplaceholder').load('./text/footerbeforelogin.html'))
        }
    })
}
loadSkeleton() // invoke the function
