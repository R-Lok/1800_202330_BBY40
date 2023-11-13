

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
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Your weekly summary',
                font: {
                    size: 20
                }
            }
        }
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

//function to clear session storage, to clear stored form values when user cancels input
function clearSessionStorage() {
    sessionStorage.clear();
    console.log("Session storage cleared");
}

//function to test eventListenerTriggers
function testEventListener() {
    console.log("You triggered the test event listener")
}

function addUseTypeToSessionStr(e) {
    let useType = e.target.getAttribute("value")
    sessionStorage.setItem("useType", useType)
    console.log("Use type stored")
}

function getUseTypeFromSessionStr() {
    return sessionStorage.getItem("useType")
}

function addMachineTypeToSessionStr(e) {
    let machineType = e.target.getAttribute("machinetype")
    sessionStorage.setItem("machine_type", machineType)
    console.log("Machine type stored")
}

function getMachineTypeFromSessionStr() {
    return sessionStorage.getItem("machine_type")
}

function addCalcFactorToSessionStr(factor) {
    sessionStorage.setItem("calc_factor", factor)
}

function getCalcFactorFromSessionStr() {
    return sessionStorage.getItem("calc_factor")
}

function getUserId() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User logged in already or has just logged in.
                console.log(user.uid)
                sessionStorage.setItem("userId", user.uid)
                let userId = user.uid
                resolve(userId)
            } else {
                reject("Not logged in")
            }
        })
    })
        
}

async function submitUseDetails(homeBoolean, useType, storedCalcFactor, storedMachineType) {
    
    try {
        let userId = await getUserId();
        db.collection("useTypes").doc(useType).get().then(doc => {
            let calc_factor = storedCalcFactor
            let createdAt = firebase.firestore.Timestamp.now().toDate()
            let estVol = doc.data().waterVolFactor
            let estCost = estVol * parseInt(calc_factor)
            let home = homeBoolean
            let machine_type = storedMachineType
            let updatedAt = firebase.firestore.Timestamp.now().toDate()
            let useType_id = useType

            db.collection("waterLogs").add({
                calc_factor: parseInt(calc_factor),
                createdAt: createdAt,
                estCost: estCost,
                estVol: estVol,
                home: home,
                machine_type: machine_type,
                updatedAt: updatedAt,
                useType_id: useType_id,
                userId: userId
            })
            console.log("Use submitted")
        });
    } catch (error) {
        console.log("Submission encountered an error")
        alert("Submission encountered an error")
    }
    
}

//test function below which doesnt actually use read/writes
// async function submitUseDetails(homeBoolean, useType, storedCalcFactor, storedMachineType) {
//     try {
//         let calc_factor = storedCalcFactor
//         let createdAt = Date.now()
//         let estVol = 5
//         let estCost = estVol * calc_factor
//         let home = homeBoolean
//         let machine_type = storedMachineType
//         let updatedAt = Date.now()
//         let useType_id = useType
//         let uid = await getUserId()

//         let submission = {
//             calc_factor: parseInt(calc_factor),
//             createdAt: createdAt,
//             estCost: estCost,
//             estVol: estVol,
//             home: home,
//             machine_type: machine_type,
//             updatedAt: updatedAt,
//             useType_id: useType_id,
//             userId: uid
//         }
//         console.log(submission)

//     } catch (error) {
//         console.log("Could not fetch userId")
//     }       
// }


//-----------------------------eventlisteners for form

//usage-select form buttons
let addWaterUseBtn = document.getElementById("add-water-usage-btn")
let flushBtn = document.getElementById("flush-btn")
let tapBtn = document.getElementById("sink-btn")
let showerBtn = document.getElementById("shower-btn")
let laundryBtn = document.getElementById("laundry-btn")
let dishwasherBtn = document.getElementById("dishwasher-btn")

addWaterUseBtn.addEventListener("click", (e) => clearSessionStorage())


//tap forms listeners & helper functions

let tapUseDurationNextBtn = document.getElementById("tap-form-next-btn")
let tapDurationSlider = document.getElementById("tapUseSlider")

tapBtn.addEventListener("click", e => addUseTypeToSessionStr(e))
tapUseDurationNextBtn.addEventListener("click", (e) => {storeTapUseDetails()})

function storeTapUseDetails() {
    addCalcFactorToSessionStr(tapDurationSlider.value / 60)
}

//flush usage listeners & helper functions
flushBtn.addEventListener("click", (e) => storeFlushUseDetails(e))

function storeFlushUseDetails(e) {
    addCalcFactorToSessionStr(1)
    addUseTypeToSessionStr(e)
}

//shower usage listeners & helper functions
let showerUseDurationNextBtn = document.getElementById("shower-form-next-btn")
let showerDurationSlider = document.getElementById("showerSlider")

showerBtn.addEventListener("click", (e) => addUseTypeToSessionStr(e))
showerUseDurationNextBtn.addEventListener("click", (e) => storeShowerUseDetails())

function storeShowerUseDetails() {
    addCalcFactorToSessionStr(showerDurationSlider.value)
}

//laundry machine usage lsiteners & helper functions
let laundryStandardBtn = document.getElementById("laundry-standard-btn")
let laundryEfficientBtn = document.getElementById("laundry-energystar-btn")
let laundryOldBtn = document.getElementById("laundry-old-btn")
let laundryBtns = [laundryStandardBtn, laundryEfficientBtn, laundryOldBtn]

laundryBtns.forEach(button => button.addEventListener("click", e => storeLaundryUseDetails(e)))

function storeLaundryUseDetails(e) {
    let calc_factor = 1

    addUseTypeToSessionStr(e)
    addMachineTypeToSessionStr(e)
    addCalcFactorToSessionStr(calc_factor)
}


//eventListeners for home and outside buttons for at-home? form
let homeSelectBtn = document.getElementById("home-use-btn")
let outsideSelectBtn = document.getElementById("outside-use-btn")

homeSelectBtn.addEventListener("click", (e) => {
    let home = true
    let calc_factor = getCalcFactorFromSessionStr()
    let machine_type = getMachineTypeFromSessionStr()
    let useType = getUseTypeFromSessionStr()

    submitUseDetails(home, useType, calc_factor, machine_type)
})

outsideSelectBtn.addEventListener("click", (e) => {
    let home = false
    let calc_factor = getCalcFactorFromSessionStr()
    let machine_type = getMachineTypeFromSessionStr()
    let useType = getUseTypeFromSessionStr()

    submitUseDetails(home, useType, calc_factor, machine_type)
})

//function to calculate and output estimated monthly water bill value
async function populateMonthCosts() {
    try{

        let userId = await getUserId();

        var monthCost = 0;
        var today = new Date();

        //Creating the date variable for the start of the month
        var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        var month = months[today.getMonth()];
        var year = today.getFullYear();
        var date = year + "-" + month + "-" + 1;
        var monthStart = new Date(date);

        //Querying database for waterLog documents that were created within 
        //the first day of the month to now, by the user at home
        db.collection("waterLogs").where("home", "==", true)
        .where("userId", "==", userId)
        .where("createdAt", ">=", monthStart)
        .where("createdAt", "<=", today)
        .onSnapshot((querySnapshot) => {
            var costs = [];
            querySnapshot.forEach((doc) => {

                costs.push(doc.data().estCost);
            }); 
            
            //Summing all estCosts from each retrieved document
            console.log(costs);
            costs.forEach(sumAll);

            function sumAll(num) {
            monthCost += num;
        }
        
        //Changing summed cost value into money format
        monthCost = "$" + parseFloat(monthCost).toFixed(2);
        
        //Replacing html content with new value
        document.getElementById("summary-stat").innerHTML = monthCost;
    });

    } catch (error){
        console.log("Monthly Cost can't be found");
        alert("Monthly Cost can't be found");
    }
} 
