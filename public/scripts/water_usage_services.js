const pickDate = (date) => {
    if (date) {
        const parts = date.split('-')
        return new Date(parts[0], parts[1] - 1, parts[2])
    }
    return new Date()
}

const adjustDay = (time) => time.getDay() === 0 ? 7 - 1 : time.getDay() - 1

const getDay = () => {
    const today = pickDate(localStorage.getItem('date'))
    today.setHours(0, 0, 0, 0)
    const todayUnix = today.getTime()
    const oneDayUnix = 60 * 60 * 24 * 1000

    const start = today
    const end = new Date(todayUnix + oneDayUnix)
    return { start, end }
}

const getWeek = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayUnix = today.getTime()
    const oneDayUnix = 60 * 60 * 24 * 1000

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

const sumDay = (doc, sum) => {
    const index = adjustDay(doc.createdAt.toDate())
    sum[index] += convert(doc.estVol)
}

const sumMonth = (doc, sum) => {
    const index = doc.createdAt.toDate().getDate() - 1
    sum[index] += convert(doc.estVol)
}
const sumYear = (doc, sum) => {
    const index = doc.createdAt.toDate().getMonth()
    sum[index] += convert(doc.estVol)
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
        throw new Error('Eh? how did you get here?')
    }
}

const convert = (item) => localStorage.getItem('system') === 'true' ? item / 3.785 : item

const getSystemString = () => localStorage.getItem('system') === 'true' ? 'Gallons' : 'Litres'

const getSum = ({ querySnapshot, type, start, resolve }) => {
    const sum = sumArray(type, start)
    console.log(querySnapshot.size)
    querySnapshot.forEach((doc) => {
        sumDict[type](doc.data(), sum)
    })
    return resolve(sum)
}

const getList = ({ querySnapshot, resolve }) => {
    console.log(querySnapshot.size)
    const results = []
    querySnapshot.forEach((doc) => {
        const item = doc.data()
        // there is a NaN behavior caused by firestore so keep this type checking please.
        if (item.estVol) {
            item.estVol = (convert(item.estVol)).toFixed(2)
        }
        results.push({ id: doc.id, ...item })
    })
    // console.log(results)
    return resolve(results)
}

const getWaterUsage = (type, callback, orderBy = 'createdAt', order = 'desc') => {
    return new Promise((resolve, reject) => {
        const userId = localStorage.getItem('userId')
        const { start, end } = dayRangeDict[type]()
        // console.log(`start: ${start}`)
        // console.log(`end: ${end}`)

        db.collection('waterLogs')
            .where('userId', '==', userId)
            .where('createdAt', '>=', start)
            .where('createdAt', '<', end)
            .orderBy(orderBy, order)
            .get()
            .then((querySnapshot) => callback({ querySnapshot, type, start, resolve }))
            .catch((error) => {
                console.log('Error getting documents: ', error)
                return reject(error)
            })
    })
}

const getAll = (table) => {
    return new Promise((resolve, reject) => {
        db.collection(table)
            .get()
            .then((querySnapshot) => getList({ querySnapshot, resolve }))
            .catch((error) => {
                console.log('Error getting documents: ', error)
                return reject(error)
            })
    })
}

const getByIdAndOwner = (table, id) => {
    return new Promise((resolve, reject) => {
        const userId = localStorage.getItem('userId')
        db.collection(table)
            .where(firebase.firestore.FieldPath.documentId(), '==', id)
            .where('userId', '==', userId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => resolve(doc.id))
            })
            .catch((error) => {
                console.log('Error getting documents: ', error)
                return reject(error)
            })
    })
}

const deleteById = (table, id) => {
    return new Promise((resolve, reject) => {
        console.log(`deleting...${id}`)
        db.collection(table)
            .doc(id)
            .delete()
            .then(() => {
                console.log('Document successfully deleted!')
                localStorage.removeItem('weekCost')
                localStorage.removeItem('monthCost')
                localStorage.removeItem('yearCost')
                return resolve()
            })
            .catch((error) => {
                console.log('Error getting documents: ', error)
                return reject(error)
            })
    })
}

const removeElementById = (id) => {
    const div = document.getElementById(id)
    div.remove()
}

const deleteWaterUsage = async (id) => {
    const waterLogId = await getByIdAndOwner('waterLogs', id)
    await deleteById('waterLogs', waterLogId)
    removeElementById(waterLogId)
}
