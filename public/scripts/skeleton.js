function loadSkeleton() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                // Load content for the user here.
                $('#navplaceholder').load('./text/navbar.html', function() {
                    $('#footerplaceholder').load('./text/footer.html', resolve)
                })
            } else {
                // No user is signed in.
                $('#navplaceholder').load('./text/navbarbeforelogin.html', function() {
                    $('#footerplaceholder').load('./text/footerbeforelogin.html', resolve)
                })
            }
        })
    })
}

// Turns icon for current page blue and set cursor to default when hovering over icon
async function blueOut() {
    await loadSkeleton() // Wait for loadSkeleton() to complete before proceeding

    const page = window.location.href
    if (new RegExp('.*main').test(page)) {
        document.getElementById('home')
            .setAttribute('style', 'filter: invert(22%) sepia(57%) saturate(3065%) hue-rotate(188deg) brightness(89%) contrast(89%);')
        document.getElementById('homeButton')
            .setAttribute('style', 'cursor: default')
    } else if (new RegExp('.*water_usage.html').test(page)) {
        document.getElementById('usage')
            .setAttribute('style', 'filter: invert(22%) sepia(57%) saturate(3065%) hue-rotate(188deg) brightness(89%) contrast(89%);')
        document.getElementById('usageButton')
            .setAttribute('style', 'cursor: default')
    } else if (new RegExp('.*waterbill').test(page)) {
        document.getElementById('waterbill')
            .setAttribute('style', 'filter: invert(22%) sepia(57%) saturate(3065%) hue-rotate(188deg) brightness(89%) contrast(89%);')
        document.getElementById('waterBillButton')
            .setAttribute('style', 'cursor: default')
    } else if (new RegExp('.*setting').test(page)) {
        document.getElementById('settings')
            .setAttribute('style', 'filter: invert(22%) sepia(57%) saturate(3065%) hue-rotate(188deg) brightness(89%) contrast(89%);')
        document.getElementById('settingsButton')
            .setAttribute('style', 'cursor: default')
    }
}

blueOut()
