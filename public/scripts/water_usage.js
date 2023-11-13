const adjustDay = (time) => time.getDay() === 0 ? 7 - 1 : time.getDay() - 1

const getWeek = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayOfWeek = adjustDay(today)

    const todayUnix = today.getTime()
    const oneDayUnix = 60 * 60 * 24 * 1000

    const start = new Date(todayUnix - (dayOfWeek * oneDayUnix))
    const end = new Date(todayUnix + oneDayUnix)
    return { start, end }
}

const getMonth = () => {
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const start = firstDayOfMonth
    const end = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 1)
    return { start, end }
}

const getYear = () => {
    const firstDayOfYear = new Date()
    firstDayOfYear.setMonth(0)
    firstDayOfYear.setDate(1)
    firstDayOfYear.setHours(0, 0, 0, 0)

    const start = firstDayOfYear
    const end = new Date(firstDayOfYear.getFullYear() + 1, 0, 1)
    return { start, end }
}

const dayRangeDict = {
    'week': getWeek,
    'month': getMonth,
    'year': getYear,
}

const sumDay = (doc, sum) => {
    const index = adjustDay(doc.createdAt.toDate())
    sum[index] = sum[index] || 0 + doc.estVol
}

const sumMonth = (doc, sum) => {
    const index = doc.createdAt.toDate().getDate() - 1
    sum[index] = sum[index] || 0 + doc.estVol
}
const sumYear = (doc, sum) => {
    const index = doc.createdAt.toDate().getMonth() - 1
    sum[index] = sum[index] || 0 + doc.estVol
}

const sumDict = {
    'week': sumDay,
    'month': sumMonth,
    'year': sumYear,
}

const daysInMonth = (time) => new Date(time.getFullYear(), time.getMonth(), 0).getDate()

const sumArray = (type, start) => {
    switch (type) {
    case 'week':
        return new Array(7).fill(0)
    case 'month':
        return new Array(daysInMonth(start)).fill(0)
    case 'year':
        return new Array(12).fill(0)
    default:
        throw new Error('Hm? how did you get here?')
    }
}

const getWaterUsage = (type, userId) => {
    return new Promise((resolve, reject) => {
        const { start, end } = dayRangeDict[type]()
        // console.log(`start: ${start}`)
        // console.log(`end: ${end}`)

        db.collection('waterLogs')
            .where('userId', '==', userId)
            .where('createdAt', '>=', start)
            .where('createdAt', '<', end)
            .get()
            .then((querySnapshot) => {
                const sum = sumArray(type, start)
                console.log(querySnapshot.size)
                querySnapshot.forEach((doc) => {
                    sumDict[type](doc.data(), sum)
                })
                resolve(sum)
            })
            .catch((error) => {
                reject(console.log('Error getting documents: ', error))
            })
    })
}

const main = async () => {
    const [weeklyData, monthlyData, yearlyData] = await Promise.all([
        getWaterUsage('week', localStorage.getItem('userId')),
        getWaterUsage('month', localStorage.getItem('userId')),
        getWaterUsage('year', localStorage.getItem('userId')),
    ])
    // console.log(weeklyData)
    // console.log(monthlyData)
    // console.log(yearlyData)

    const weekly = document.getElementById('water-usage-chart-weekly')
    const monthly = document.getElementById('water-usage-chart-monthly')
    const yearly = document.getElementById('water-usage-chart-yearly')

    const weeklyToggle = document.getElementById('weekly-label')
    const monthlyToggle = document.getElementById('monthly-label')
    const yearlyToggle = document.getElementById('yearly-label')

    weeklyToggle.addEventListener('click', (e) => {
        weekly.style.display = 'block'
        monthly.style.display = 'none'
        yearly.style.display = 'none'
    })

    monthlyToggle.addEventListener('click', (e) => {
        weekly.style.display = 'none'
        monthly.style.display = 'block'
        yearly.style.display = 'none'
    })

    yearlyToggle.addEventListener('click', (e) => {
        weekly.style.display = 'none'
        monthly.style.display = 'none'
        yearly.style.display = 'block'
    })

    new Chart(weekly, {
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
            indexAxis: 'y',
            maintainAspectRatio: false,
        },
    })

    new Chart(monthly, {
        type: 'bar',
        data: {
            labels: [...Array(daysInMonth(new Date(Date.now()))).keys()],
            datasets: [{
                label: 'Liters of water',
                data: monthlyData,
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            indexAxis: 'y',
            maintainAspectRatio: false,
        },
    })

    new Chart(yearly, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Liters of water',
                data: yearlyData,
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            indexAxis: 'y',
            maintainAspectRatio: false,
        },
    })
}

main()
