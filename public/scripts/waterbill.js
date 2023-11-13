//Function for getting current user ID
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


//Function for populating current week's water bill cost
async function populateWeeklyCosts() {

    //try catch blocks to catch errors
    try{


        //get current logged in userID
        let userId = await getUserId();
        
        //Initialize final cost variable
        var weekCost = 0;

        //Create a date for today
        var d = new Date();

        //Change today's date to string
        var totalWords = d.toString();

        //Remove all words except the first string representing the weekday
        var firstWord = totalWords.replace(/ .*/,"");

        //Creating a new date variable to store previous Monday's date.
        var lastMonday = new Date();
        
        //Using today's weekday string and date to determine previous monday's date.
        switch (firstWord) {

        case "Mon": 
            break;
        case "Tue":
            lastMonday.setDate(d.getDate() - 1)
            break;
        case "Wed":
            lastMonday.setDate(d.getDate() - 2)
            break;
        case "Thu":
            lastMonday.setDate(d.getDate() - 3)
            break;
        case "Fri":
            lastMonday.setDate(d.getDate() - 4)
            break;
        case "Sat":
            lastMonday.setDate(d.getDate() - 5)
            break;
        case "Sun":
            lastMonday.setDate(d.getDate() - 6)
        
        }

        //Converting lastMonday's date to year-month-day format to set time to 00:00:00.
        var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        var year = lastMonday.getFullYear();
        var month = months[lastMonday.getMonth()];
        var day = lastMonday.getDate();
        var date = year + "-" + month + "-" + day;
        var start = new Date (date);


        //Querying database for waterLog documents within specific timeframe 
        //and created by the logged in user
        db.collection("waterLogs").where("home", "==", true)
        .where("userId", "==", userId)
        .where("createdAt", ">=", start)
        .where("createdAt", "<=", d)
        .onSnapshot((querySnapshot) => {
            var costs = [];
            querySnapshot.forEach((doc) => {

                costs.push(doc.data().estCost);
            }); 
            
            //Summing all estCosts from each document
            console.log(costs);
            costs.forEach(sumAll);

            function sumAll(num) {
            weekCost += num;
        }
        
        //Changing summed cost value into money format
        weekCost = "$" + parseFloat(weekCost).toFixed(2);
        
        //Replacing Weekly Waterbill's html content with new value
        document.getElementById("weekCost").innerHTML = weekCost;
    });

} catch (error) {
  console.log("Weekly Cost can't be found");
  alert("Weekly Cost can't be found");
}
}

// Call function to enter value into weekly waterbill section
populateWeeklyCosts();



//Calculating and populating current month's water bill cost
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

        //Querying database for waterLog documents within specific timeframe 
        //and created by the logged in user
        db.collection("waterLogs").where("home", "==", true)
        .where("userId", "==", userId)
        .where("createdAt", ">=", monthStart)
        .where("createdAt", "<=", today)
        .onSnapshot((querySnapshot) => {
            var costs = [];
            querySnapshot.forEach((doc) => {

                costs.push(doc.data().estCost);
            }); 
            
            //Summing all estCosts from each document
            console.log(costs);
            costs.forEach(sumAll);

            function sumAll(num) {
            monthCost += num;
        }
        
        //Changing summed cost value into money format
        monthCost = "$" + parseFloat(monthCost).toFixed(2);
        
        //Replacing html content with new value
        document.getElementById("monthCost").innerHTML = monthCost;
    });

    } catch (error){
        console.log("Monthly Cost can't be found");
        alert("Monthly Cost can't be found");
    }
} 

//populateMonthCosts();


//Calculating and populating current year's waterbill cost
async function populateYearCosts() {
    try{

        let userId = await getUserId();

        var yearCost = 0;

        var today = new Date();

        var year = today.getFullYear();
        var date = year + "-" + 1 + "-" + 1;
        var yearStart = new Date(date);

        //Querying database for waterLog documents within specific timeframe 
        //and created by the logged in user
        db.collection("waterLogs").where("home", "==", true)
        .where("userId", "==", userId)
        .where("createdAt", ">=", yearStart)
        .where("createdAt", "<=", today)
        .onSnapshot((querySnapshot) => {
            var costs = [];
            querySnapshot.forEach((doc) => {

                costs.push(doc.data().estCost);
            }); 
            
            //Summing all estCosts from each document
            console.log(costs);
            costs.forEach(sumAll);

            function sumAll(num) {
            yearCost += num;
        }
        
        //Changing summed cost value into money format
        yearCost = "$" + parseFloat(yearCost).toFixed(2);
        
        //Replacing Weekly Waterbill's html content with new value
        document.getElementById("yearCost").innerHTML = yearCost;
    });

    } catch (error){
        console.log("Yearly Cost can't be found");
        alert("Yearly Cost can't be found");
    }
} 



//Calculating and populating total waterbill costs
async function populateTotalCosts() {
    try{

        let userId = await getUserId();

        var totalCost = 0;


    db.collection("waterLogs").where("home", "==", true)
    .where("userId", "==", userId)
        .onSnapshot((querySnapshot) => {
            var costs = [];
            querySnapshot.forEach(async (doc) => {
                costs.push(doc.data().estCost);
            });
        
        costs.forEach(sumAll);

        function sumAll(num) {
            totalCost += num;
        }

        totalCost = "$" + parseFloat(totalCost).toFixed(2);

        console.log(weekCostOutput);
        
    document.getElementById("totalCost").innerHTML = totalCost;
});

} catch (error) {
    console.log("Total Cost can't be found");
    alert ("Total Cost can't be found")
}
}

//Call function to enter value into total waterbill section
//populateTotalCosts();


