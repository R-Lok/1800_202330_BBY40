function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('logging out user')
        localStorage.clear()
        redirectToIndex()
    }).catch((error) => {
        // An error happened.
    })
}

function checkIfLoggedIn() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            redirectToIndex()
        }
    })
}

function redirectToIndex() {
    window.location.href = './index.html'
}

const setToggle = (ids) => {
    for (const id of ids) {
        if (localStorage.getItem(id) === 'true' && document.getElementById(id)) {
            document.getElementById(id).checked = true
        }
    }
}

const saveToggle = (id) => {
    localStorage.setItem(id, document.getElementById(id).checked)
    applyTheme()
}

const applyTheme = () => {
    if (localStorage.getItem('theme') === 'false') {
        document.getElementById('main_css').href = './styles/style.css'
    } else {
        document.getElementById('main_css').href = './styles/dark_mode.css'
    }
}

checkIfLoggedIn()
setToggle(['system', 'theme'])
applyTheme()

/* Icon grey out, currently not working
function getCurrentURL() {
    return window.location.href
}

function iconGreyOut() {
    var page = getCurrentURL();
    var main = "http://localhost:3000/main.html"
    var usage = "http://localhost:3000/water_usage.html"
    var waterbill = "http://localhost:3000/waterbill.html"
    var settings = "http://localhost:3000/setting.html"


    switch (page) {

        case main:
            document.getElementById("home")
            .setAttribute("style", "filter: invert(64%) sepia(86%) saturate(0%) hue-rotate(240deg) brightness(98%) contrast(95%);");
            break;

        case usage:
            document.getElementById("usage")
            .setAttribute("style", "filter: invert(64%) sepia(86%) saturate(0%) hue-rotate(240deg) brightness(98%) contrast(95%);");

        break;

        case waterbill:
            document.getElementById("waterbill")
            .setAttribute("style", "filter: invert(64%) sepia(86%) saturate(0%) hue-rotate(240deg) brightness(98%) contrast(95%);");

        break;

        case settings:
            document.getElementById("settings")
            .setAttribute("style", "filter: invert(64%) sepia(86%) saturate(0%) hue-rotate(240deg) brightness(98%) contrast(95%);");

        break;


    }
    
}

document.addEventListener('DOMContentLoaded', iconGreyOut());

*/