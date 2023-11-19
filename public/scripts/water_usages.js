const adjustDay = (time) => time.getDay() === 0 ? 7 - 1 : time.getDay() - 1

const getBasicDay = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayUnix = today.getTime()
    const oneDayUnix = 60 * 60 * 24 * 1000
    return { today, todayUnix, oneDayUnix }
}

const getDay = () => {
    const { today, todayUnix, oneDayUnix } = getBasicDay()

    const start = today
    const end = new Date(todayUnix + oneDayUnix)
    return { start, end }
}

const getWeek = () => {
    const { today, todayUnix, oneDayUnix } = getBasicDay()

    const dayOfWeek = adjustDay(today)
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
    'day': getDay,
    'week': getWeek,
    'month': getMonth,
    'year': getYear,
}

const getList = ({ querySnapshot, resolve }) => {
    console.log(querySnapshot.size)
    let html = ''
    querySnapshot.forEach((doc) => {
        console.log(doc.data())
        html += `<div>${JSON.stringify(doc.data())}</div>`
    })
    return resolve(html)
}

const getWaterUsage = (type, callback) => {
    return new Promise((resolve, reject) => {
        const userId = localStorage.getItem('userId')
        const { start, end } = dayRangeDict[type]()
        // console.log(`start: ${start}`)
        // console.log(`end: ${end}`)

        db.collection('waterLogs')
            .where('userId', '==', userId)
            .where('createdAt', '>=', start)
            .where('createdAt', '<', end)
            .get()
            .then((querySnapshot) => callback({ querySnapshot, type, start, resolve }))
            .catch((error) => {
                console.log('Error getting documents: ', error)
                return reject(error)
            })
    })
}

const insertHTML = (html) => {
    const parent = document.getElementById('water-usage-container')
    parent.innerHTML = html
}

const main = async () => {
    const html = await getWaterUsage('day', getList)
    insertHTML(html)
}

main()
