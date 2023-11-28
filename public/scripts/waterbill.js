//Function for getting current userId
function getUserId() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User logged in already or has just logged in.
                let userId = user.uid
                resolve(userId)
            } else {
                reject("Not logged in")
            }
        })
    })
        
}

//Function for getting start date for week, month, or year
function getStartDate(type){

    const currentDate = new Date();
    var start;

    //Set start date to previous Monday at time of 00:00:00
    if (type === "week") {

        const dayOfWeek = currentDate.getDay();
        const difference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const timeFromMonday = (difference * 86400 * 1000);
        start = new Date((Date.now() - timeFromMonday));
        start.setHours(0,0,0,0);
        return start;
        
    //Set start date to first day of current month at time of 00:00:00
    } else if (type === "month") {
        
        const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        const month = months[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        const date = year + "-" + month + "-" + 1;
        start = new Date(date);
        return start;

    //Set start date to first day of current year at time of 00:00:00
    } else {
        var year = currentDate.getFullYear();
        var date = year + "-" + 1 + "-" + 1;
        start = new Date(date);
        return start;
    }
}

//Function for populating water bill of parameter type
async function populateCosts(type) {

    try{
        let userId = await getUserId();
        var billCost = 0;
        
        //Declaring end date for all water bill types to be tomorrow at 00:00:00
        const end = new Date((Date.now() + 86400 * 1000));
        end.setHours(0,0,0,0);

        
        //Querying database for waterLog documents that were created within 
        //start and end date from user at home
        db.collection("waterLogs").where("home", "==", true).where("userId", "==", userId)
        .where("createdAt", ">=", getStartDate(type))
        .where("createdAt", "<", end)
        .onSnapshot((querySnapshot) => {
            var costs = [];
            querySnapshot.forEach((doc) => {

                costs.push(doc.data().estCost);
            }); 
            
            //Summing all estCost values from each document
            costs.forEach(sumAll);

            function sumAll(num) {
            billCost += num;
        }
        
        //Changing summed cost value into money format
        billCost = "$" + parseFloat(billCost).toFixed(2);
        
        //Replacing html content of parameter type waterbill with final summed value
        document.getElementById(type).innerHTML = billCost;
    });
    
    } catch (error){
    console.log("Cost can't be found");
    alert("Cost can't be found");
}
}

populateCosts("week");
populateCosts("month");
populateCosts("year");

//Get display name of current logged in user to populate greeting message
function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            userName=user.displayName;
            document.getElementById("name-goes-here").innerText = userName;
        } else {
        }
    })
}

getNameFromAuth();