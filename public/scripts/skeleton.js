function loadSkeleton() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                // Load content for the user here.
                $('#navplaceholder').load('./text/navbar.html', function() {
                    $('#footerplaceholder').load('./text/footer.html', resolve);
                });
            } else {
                // No user is signed in.
                $('#navplaceholder').load('./text/navbarbeforelogin.html', function() {
                    $('#footerplaceholder').load('./text/footerbeforelogin.html', resolve);
                });
            }
        });
    });
}

async function blueOut() {
    await loadSkeleton(); // Wait for loadSkeleton() to complete before proceeding
    
    const page = window.location.href;
    if (new RegExp('.*main.html').test(page)){
        document.getElementById("home")
        .setAttribute("style", "filter: invert(25%) sepia(71%) saturate(1573%) hue-rotate(184deg) brightness(93%) contrast(91%);");
    } else if (new RegExp('.*water_usage.html').test(page)){
        document.getElementById('usage')
        .setAttribute("style", "filter: invert(25%) sepia(71%) saturate(1573%) hue-rotate(184deg) brightness(93%) contrast(91%);");
    } else if (new RegExp('.*waterbill.html').test(page)){
        document.getElementById('waterbill')
        .setAttribute("style", "filter: invert(25%) sepia(71%) saturate(1573%) hue-rotate(184deg) brightness(93%) contrast(91%);");
    } else if (new RegExp('.*setting').test(page)){
        document.getElementById('settings')
        .setAttribute("style", "filter: invert(25%) sepia(71%) saturate(1573%) hue-rotate(184deg) brightness(93%) contrast(91%);");
    }
}

loadSkeleton().then(blueOut);


