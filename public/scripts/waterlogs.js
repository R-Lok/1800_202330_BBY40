const insertHTML = (docs) => {
    const parent = document.getElementById('edit-water-usage-container')
    const temp = document.getElementById('template-waterlogs')

    for (const doc of docs) {
        const clone = temp.content.cloneNode(true)
        const div = clone.querySelector('div')
        div.id = doc.id
        for (const key of Object.keys(doc)) {
            const span = clone.querySelector(`.${key}`)
            if (span && !doc[key]) {
                span.style.display = 'none'
            }

            if (span && span.className === 'createdAt') {
                span.textContent = `${doc[key]}`
            } else if (span) {
                span.textContent = `${key}: ${doc[key]}`
            }
        }

        const deleteBtn = clone.querySelector('.delete-btn')
        deleteBtn.addEventListener('click', (event) => {
            confirm('Are you sure you want to delete this waterlog?') ? deleteWaterUsage(doc.id) : event.preventDefault()
        }, false)
        parent.appendChild(clone)
    }
}

const selectDate = () => {
    localStorage.setItem('date', document.getElementById('Selected_date').value)
    window.location.href = './waterlogs.html'
}

const showSelectedDate = () => document.getElementById('Selected_date').value = localStorage.getItem('date') || new Date().toLocaleDateString('en-CA')

// make a dictionary for join
const getUseTypeDict = async () => {
    const useTypes = await getAll('useTypes')
    const useTypeDict = useTypes.reduce((map, useType) => {
        map[useType.id] = useType.name
        return map
    }, {})
    localStorage.setItem('useTypeDict', JSON.stringify(useTypeDict))
    return useTypeDict
}

const main = async () => {
    const useTypeDict = JSON.parse(localStorage.getItem('useTypeDict')) || await getUseTypeDict()

    const waterUsages = await getWaterUsage('day', getList)
    const data = waterUsages.map((waterUsage) => {
        waterUsage.updatedAt = waterUsage.updatedAt.toDate()
        waterUsage.createdAt = waterUsage.createdAt.toDate()
        // join useTypes and waterLogs
        waterUsage.useType = useTypeDict[waterUsage.useType_id]
        return waterUsage
    })

    insertHTML(data)
    showSelectedDate()
}

main()
