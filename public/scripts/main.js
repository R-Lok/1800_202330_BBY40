

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here:
            console.log(user.uid) // print the uid in the browser console
            console.log(user.displayName) // print the user name in the browser console
            userName = user.displayName

            // method #1:  insert with JS
            document.getElementById('name-goes-here').innerText = userName

            // method #2:  insert using jquery
            // $("#name-goes-here").text(userName); //using jquery

            // method #3:  insert using querySelector
            // document.querySelector("#name-goes-here").innerText = userName
        } else {
            // No user is signed in.
        }
    })
}

const main = async () => {
    const weeklyData = await getWaterUsage('week', getSum)
    const mainPageCanvas = document.getElementById('main-page-chart')

    new Chart(mainPageCanvas, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Liters of water',
                data: weeklyData,
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${localStorage.getItem('userName')}'s Weekly Summary`,
                    font: {
                        size: 20,
                    },
                },
            },
        },
    })
}

main()

const editWaterButton = document.getElementById('edit-day-usage-btn')
editWaterButton.addEventListener('click', () => {
    window.location.href = './edit_usage.html'
})

// We will need to write functions to post form data to firestore in future
const showerSlider = document.getElementById('showerSlider')
const showerSliderValDisplay = document.getElementById('shower-duration')

showerSlider.addEventListener('input', (e) => {
    showerSliderValDisplay.innerText = `${showerSlider.value}m`
})

const tapSlider = document.getElementById('tapUseSlider')
const tapSliderValDisplay = document.getElementById('tap-use-duration')

tapSlider.addEventListener('input', (e) => {
    const tapUseMinutes = Math.trunc(tapSlider.value / 60)
    const tapUseSeconds = tapSlider.value % 60

    if (tapUseMinutes != 0 && tapUseSeconds != 0) {
        tapSliderValDisplay.innerText = `${tapUseMinutes}m${tapUseSeconds}s`
    } else if (tapUseSeconds == 0) {
        tapSliderValDisplay.innerText = `${tapUseMinutes}m`
    } else {
        tapSliderValDisplay.innerText = `${tapUseSeconds}s`
    }
})

// function to clear session storage, to clear stored form values when user cancels input
function clearSessionStorage() {
    sessionStorage.clear()
    console.log('Session storage cleared')
}

// function to test eventListenerTriggers
function testEventListener() {
    console.log('You triggered the test event listener')
}

function addUseTypeToSessionStr(e) {
    const useType = e.target.getAttribute('value')
    sessionStorage.setItem('useType', useType)
    console.log('Use type stored')
}

function getUseTypeFromSessionStr() {
    return sessionStorage.getItem('useType')
}

function addMachineTypeToSessionStr(e) {
    const machineType = e.target.getAttribute('machinetype')
    sessionStorage.setItem('machine_type', machineType)
    console.log('Machine type stored')
}

function getMachineTypeFromSessionStr() {
    return sessionStorage.getItem('machine_type')
}

function addCalcFactorToSessionStr(factor) {
    sessionStorage.setItem('calc_factor', factor)
}

function getCalcFactorFromSessionStr() {
    return sessionStorage.getItem('calc_factor')
}

function getUserId() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User logged in already or has just logged in.
                const userId = user.uid
                resolve(userId)
            } else {
                reject('Not logged in')
            }
        })
    })
}

// todo: remove
function getUserName() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User logged in already or has just logged in.
                const userName = user.displayName
                resolve(userName)
            } else {
                reject('Not logged in')
            }
        })
    })
}

// todo: fix
function getPriceFactor() {
    // currently assumes that the user is in canada, as the doc retrieved is the canada document
    return new Promise((resolve, reject) => {
        db.collection('priceFactors').doc('36380e25-46b3-4ae9-a17c-3d95e7080a1f').get()
            .then((doc) => {
                if (doc.data().costPerLitre) {
                    resolve(doc.data().costPerLitre)
                } else {
                    reject(Console.log('Could not fetch cost per litre'))
                }
            })
            .catch((error) => {
                console.log('Could not reach firestore')
            })
    })
}

async function submitUseDetails(homeBoolean, useType, storedCalcFactor, storedMachineType) {
    try {
        const priceFactor = await getPriceFactor()
        const userId = await getUserId()
        db.collection('useTypes').doc(useType).get().then((doc) => {
            const calc_factor = storedCalcFactor
            const createdAt = firebase.firestore.Timestamp.now().toDate()
            const estVol = doc.data().waterVolFactor * calc_factor
            const estCost = estVol * priceFactor
            const home = homeBoolean
            const machine_type = storedMachineType
            const updatedAt = firebase.firestore.Timestamp.now().toDate()
            const useType_id = useType

            db.collection('waterLogs').add({
                calc_factor: parseInt(calc_factor),
                createdAt: createdAt,
                estCost: estCost,
                estVol: estVol,
                home: home,
                machine_type: machine_type,
                updatedAt: updatedAt,
                useType_id: useType_id,
                userId: userId,
            })
            console.log('Use submitted')
            displaySuccessNotif()
        })
    } catch (error) {
        console.log('Submission encountered an error')
        displayFailNotif()
    }
}

// test function below which doesnt actually use read/writes
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


// -----------------------------eventlisteners for form

// usage-select form buttons
const addWaterUseBtn = document.getElementById('add-water-usage-btn')
const flushBtn = document.getElementById('flush-btn')
const tapBtn = document.getElementById('sink-btn')
const showerBtn = document.getElementById('shower-btn')
const laundryBtn = document.getElementById('laundry-btn')
const dishwasherBtn = document.getElementById('dishwasher-btn')
const cancelBtns = document.querySelectorAll('.form-close-btn')

addWaterUseBtn.addEventListener('click', (e) => clearSessionStorage())

// make all cancel buttons display cancel notif
cancelBtns.forEach((element) => {
    element.addEventListener('click', (e) => displayCancelNotif())
})

// tap forms listeners & helper functions

const tapUseDurationNextBtn = document.getElementById('tap-form-next-btn')
const tapDurationSlider = document.getElementById('tapUseSlider')

tapBtn.addEventListener('click', (e) => addUseTypeToSessionStr(e))
tapUseDurationNextBtn.addEventListener('click', (e) => {
    storeTapUseDetails()
})

function storeTapUseDetails() {
    addCalcFactorToSessionStr(tapDurationSlider.value / 60)
}

// flush usage listeners & helper functions
flushBtn.addEventListener('click', (e) => storeFlushUseDetails(e))

function storeFlushUseDetails(e) {
    addCalcFactorToSessionStr(1)
    addUseTypeToSessionStr(e)
}

// shower usage listeners & helper functions
const showerUseDurationNextBtn = document.getElementById('shower-form-next-btn')
const showerDurationSlider = document.getElementById('showerSlider')

showerBtn.addEventListener('click', (e) => addUseTypeToSessionStr(e))
showerUseDurationNextBtn.addEventListener('click', (e) => storeShowerUseDetails())

function storeShowerUseDetails() {
    addCalcFactorToSessionStr(showerDurationSlider.value)
}

// laundry machine usage listeners & helper functions,  can be further optimised using html classes
const laundryStandardBtn = document.getElementById('laundry-standard-btn')
const laundryEfficientBtn = document.getElementById('laundry-energystar-btn')
const laundryOldBtn = document.getElementById('laundry-old-btn')
const laundryBtns = [laundryStandardBtn, laundryEfficientBtn, laundryOldBtn]

laundryBtns.forEach((button) => button.addEventListener('click', (e) => storeLaundryOrDishwasherUseDetails(e)))

function storeLaundryOrDishwasherUseDetails(e) {
    const calc_factor = 1

    addUseTypeToSessionStr(e)
    addMachineTypeToSessionStr(e)
    addCalcFactorToSessionStr(calc_factor)
}

// dishwasher machine usage listeners & helper functions, can be further optimised using html classes
const dishwasherStandardBtn = document.getElementById('dishwasher-standard-btn')
const dishwasherEfficientBtn = document.getElementById('dishwasher-energystar-btn')
const dishwasherBtns = [dishwasherStandardBtn, dishwasherEfficientBtn]

dishwasherBtns.forEach((button) => button.addEventListener('click', (e) => storeLaundryOrDishwasherUseDetails(e)))
dishwasherBtns.forEach((button) => button.addEventListener('click', (e) => {
    const home = false
    const calc_factor = getCalcFactorFromSessionStr()
    const machine_type = getMachineTypeFromSessionStr()
    const useType = getUseTypeFromSessionStr()

    submitUseDetails(home, useType, calc_factor, machine_type)
}))


// eventListeners for home and outside buttons for at-home? form
const homeSelectBtn = document.getElementById('home-use-btn')
const outsideSelectBtn = document.getElementById('outside-use-btn')

homeSelectBtn.addEventListener('click', (e) => {
    const home = true
    const calc_factor = getCalcFactorFromSessionStr()
    const machine_type = getMachineTypeFromSessionStr()
    const useType = getUseTypeFromSessionStr()

    submitUseDetails(home, useType, calc_factor, machine_type)
})

outsideSelectBtn.addEventListener('click', (e) => {
    const home = false
    const calc_factor = getCalcFactorFromSessionStr()
    const machine_type = getMachineTypeFromSessionStr()
    const useType = getUseTypeFromSessionStr()

    submitUseDetails(home, useType, calc_factor, machine_type)
})

// display successful submission notif

function displaySuccessNotif() {
    const notif = document.getElementById('main-notif')
    notif.innerText = 'Water use submitted!'
    notif.setAttribute('class', '')
    notif.classList.add('alert')
    notif.classList.add('alert-success')
    hideNotif()
}

// display water cancelled submission notif
function displayCancelNotif() {
    const notif = document.getElementById('main-notif')
    notif.innerText = 'Submission cancelled!'
    notif.setAttribute('class', '')
    notif.classList.add('alert')
    notif.classList.add('alert-danger')
    hideNotif()
}

// display submission failed notif
function displayFailNotif() {
    const notif = document.getElementById('main-notif')
    notif.innerText = 'Submission failed, please try again!'
    notif.setAttribute('class', '')
    notif.classList.add('alert')
    notif.classList.add('alert-warning')
    hideNotif()
}

// make notif hidden
function hideNotif() {
    setTimeout(() => {
        const notif = document.getElementById('main-notif')
        notif.classList.add('hidden')
    }, 3000)
}

// function to calculate and output estimated monthly water bill value
async function populateMonthCosts() {
    try {
        const userId = await getUserId()

        let monthCost = 0
        const today = new Date()

        // Creating the date variable for the start of the month
        const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        const month = months[today.getMonth()]
        const year = today.getFullYear()
        const date = year + '-' + month + '-' + 1
        const monthStart = new Date(date)

        // Querying database for waterLog documents that were created within
        // the first day of the month to now, by the user at home
        db.collection('waterLogs').where('home', '==', true)
            .where('userId', '==', userId)
            .where('createdAt', '>=', monthStart)
            .where('createdAt', '<=', today)
            .onSnapshot((querySnapshot) => {
                const costs = []
                querySnapshot.forEach((doc) => {
                    costs.push(doc.data().estCost)
                })

                // Summing all estCosts from each retrieved document
                console.log(costs)
                costs.forEach(sumAll)

                function sumAll(num) {
                    monthCost += num
                }

                // Changing summed cost value into money format
                monthCost = 'This Month\'s Water Bill Estimate: ' + '$' + parseFloat(monthCost).toFixed(2)

                // Replacing html content with new value
                document.getElementById('summary-stat').innerHTML = monthCost
            })
    } catch (error) {
        console.log('Monthly Cost can\'t be found')
        alert('Monthly Cost can\'t be found')
    }
}
