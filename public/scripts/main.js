function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
        }
    });
}

const mainPageCanvas = document.getElementById("main-page-chart")

// When we integrate backend, will need to make data below be pulled from firestore (currently filled with placeholders)
new Chart(mainPageCanvas, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Liters of water',
            data: [10, 20, 30, 40, 50, 60, 70],
            borderWidth: 1,
            backgroundColor: '#478BC0'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true
    }
})

//We will need to write functions to post form data to firestore in future
const showerSlider = document.getElementById("showerSlider")
const showerSliderValDisplay = document.getElementById("shower-duration")

showerSlider.addEventListener('input', e => {
    showerSliderValDisplay.innerText = `${showerSlider.value}m`
})

const tapSlider = document.getElementById("tapUseSlider")
const tapSliderValDisplay = document.getElementById("tap-use-duration")

tapSlider.addEventListener('input', e => {
    let tapUseMinutes = Math.trunc(tapSlider.value / 60)
    let tapUseSeconds = tapSlider.value % 60

    if (tapUseMinutes != 0 && tapUseSeconds != 0) {
        tapSliderValDisplay.innerText = `${tapUseMinutes}m${tapUseSeconds}s`
    } else if (tapUseSeconds == 0) {
        tapSliderValDisplay.innerText = `${tapUseMinutes}m`
    } else {
        tapSliderValDisplay.innerText = `${tapUseSeconds}s`
    }
})