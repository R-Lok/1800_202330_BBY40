// Function for populating current week's water bill cost
const populateCosts = (id, cost) => document.getElementById(id).innerHTML = '$' + parseFloat(cost).toFixed(2)

const main = async () => {
    // Get display name of current logged in user to populate greeting message
    document.getElementById('name-goes-here').innerText = localStorage.getItem('userName')
    const [weekCost, monthCost, yearCost] = await Promise.all([
        getCosts('week'),
        getCosts('month'),
        getCosts('year'),
    ])
    populateCosts('weekCost', weekCost)
    populateCosts('monthCost', monthCost)
    populateCosts('yearCost', yearCost)
}

main()
