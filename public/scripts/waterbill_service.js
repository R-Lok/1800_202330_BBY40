// Function for populating current week's water bill cost
const getCosts = (type) => {
    const { start, end } = dayRangeDict[type]()
    // Querying database for waterLog documents that were created within
    // last monday to now, by the user at home
    return new Promise((resolve, reject) => {
        db.collection('waterLogs')
            .where('home', '==', true)
            .where('userId', '==', localStorage.getItem('userId'))
            .where('createdAt', '>=', start)
            .where('createdAt', '<', end)
            .get()
            .then((querySnapshot) => {
                let cost = 0
                querySnapshot.forEach((doc) => {
                    cost += doc.data().estCost
                })
                localStorage.setItem(`${type}Cost`, cost)
                return resolve(cost)
            })
            .catch((error) => {
                console.log('Error getting documents: ', error)
                return reject(error)
            })
    })
}
