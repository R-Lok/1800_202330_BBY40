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

//Function for populating weekly cost of user
async function populateWeeklyCosts() {

    //try catch blocks to catch errors
    try{


        //get current logged in userID
        let userId = await getUserId();
        
        //Initialize final cost variable
        var weekCost = 0;

        //Create a date for today and setting a variable to its UNIX time
        var d = new Date();
        var today = d.getTime();

        //Change today's date to string
        var totalWords = d.toString();

        //Remove all words except the first string representing
        //the weekday
        var firstWord = totalWords.replace(/ .*/,"");

        //Creating a variable to store the unix time for the previous Monday
        var lastMonday;
        
        //Using today's weekday string and UNIX time to calculate the previous
        //Monday's UNIX time.
        switch (firstWord) {

        case "Mon": 
            lastMonday = today;
            break;
        case "Tue":
            lastMonday = today - 86400000;
            break;
        case "Wed":
            lastMonday = today - 2*86400000;
            break;
        case "Thu":
            lastMonday = today - 3*86400000;
            break;
        case "Fri":
            lastMonday = today - 4*86400000;
            break;
        case "Sat":
            lastMonday = today - 5*86400000;
            break;
        case "Sun":
            lastMonday = today - 6*86400000;
        
        }

        //Converting the UNIX time of the previous monday to date format
        var monday = new Date (lastMonday);
        var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        var year = monday.getFullYear();
        var month = months[monday.getMonth()];
        var day = monday.getDate();
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


/*

//Calculating and populating overall costs
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
populateTotalCosts();

*/
