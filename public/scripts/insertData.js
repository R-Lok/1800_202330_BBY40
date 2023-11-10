const path = require('path')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) })
const { initializeApp } = require('firebase/app')
const {
    getFirestore,
    collection,
    getDocs,
    writeBatch,
    doc,
    where,
    query,
    deleteDoc,
    getCountFromServer,
    Timestamp,
    documentId,
    orderBy,
    limit,
} = require('firebase/firestore')
const useTypes = require('../../useTypes.json')
const priceFactors = require('../../priceFactors.json')

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const getData = async (name) => {
    const coll = collection(db, name)
    // const results = await getDocs(coll).then((results) => results.docs.map((doc) => doc.data()))
    const snapshot = await getCountFromServer(coll)
    // console.log(results)
    console.log('count: ', snapshot.data().count)
    // return results
}

const getDataById = async () => {
    const q = query(collection(db, 'cities'), where(documentId(), '==', 'NYC'))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data())
    })
}

const getTimestamp = async () => {
    const q = query(collection(db, 'useTypes'), orderBy('createdAt', 'desc'), limit(1))
    const querySnapshot = await getDocs(q)
    let time
    querySnapshot.forEach(async (doc) => {
        time = doc.data().createdAt.toDate()
    })
    return time
}

const getDataByTime = async (name, time) => {
    const q = query(collection(db, name), where('createdAt', '<', time))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data())
    })
}

const deleteData = async (name) => {
    await getDocs(collection(db, name))
        .then((results) => results.docs.map((doc) => deleteDoc(doc.ref)))
    console.log('done')
}

const batchWrite = async (name, items) => {
    const batch = writeBatch(db)
    for (const item of items) {
        const now = Timestamp.now()
        item['updatedAt'] = now
        item['createdAt'] = now
        batch.set(doc(db, name, uuidv4()), item)
    }
    await batch.commit()
    console.log('done')
}

const insertWaterLogs = async () => {
    const userIds = await getDocs(collection(db, 'users'))
        .then((results) => results.docs.map((doc) => doc.id))

    const useTypes = await getDocs(collection(db, 'useTypes'))
        .then((results) => results.docs.map((doc) => {
            const id = doc.id
            return { id, ...doc.data() }
        }))

    const querySnapshot = await getDocs(query(collection(db, 'priceFactors'), where('country', '==', 'Canada')))
    let costPerLitre
    querySnapshot.forEach((doc) => {
        costPerLitre = doc.data().costPerLitre
    // console.log(doc.id, ' => ', doc.data().costPerLitre)
    })
    // console.log(costPerLitre)
    // console.log(userIds)
    // console.log(useTypes)

    const waterLogs = []
    for (let i = 0; i < 7300; i++) {
        const useType = useTypes[Math.floor(Math.random() * 8)]
        const createdAt = Timestamp.now().toDate()
        const expiresIn = Math.floor(Math.random() * 365) * 60 * 60 * 24
        createdAt.setSeconds(createdAt.getSeconds() + expiresIn)
        const calcfactor = Math.floor(Math.random() * 11)
        const estVol = useType.waterVolFactor * calcfactor
        const estCost = estVol * costPerLitre
        waterLogs.push({
            'useType_id': useType.id,
            'calcfactor': calcfactor,
            'machine_type': useType.model,
            'estVol': estVol,
            'estCost': estCost,
            'userId': userIds[i % 2],
            'home': i % 2 === 0,
            'updatedAt': createdAt,
            'createdAt': createdAt,
        })
    }
    let batch = writeBatch(db)
    let count = 0
    let total = 0
    for (const item of waterLogs) {
        batch.set(doc(db, 'waterLogs', uuidv4()), item)
        count++
        total++
        if (count === 500) {
            await batch.commit()
            console.log(`insert ${count} records`)
            count = 0
            batch = writeBatch(db)
        }
    }
    console.log(`insert ${count} records`)
    await batch.commit()
    console.log(`${total} records inserted.`)
}

const main = async () => {
    // await batchWrite('useTypes', useTypes)
    // await batchWrite('priceFactors', priceFactors)
    // await insertWaterLogs()

    // getDataByTime('useTypes', await getTimestamp())
    // await getData('useTypes')
    // await getData('waterLogs')

    // await getDataById()
    // await deleteData('useTypes')
    // await deleteData('priceFactors')
    // await deleteData('waterLogs')
}

main()
