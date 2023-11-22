const insertHTML = (docs) => {
    const parent = document.getElementById('water-usage-container')
    const temp = document.getElementById('template-waterlogs')

    for (const doc of docs) {
        const clone = temp.content.cloneNode(true)
        const div = clone.querySelector('div')
        div.id = doc.id
        for (const key of Object.keys(doc)) {
            const span = clone.querySelector(`.${key}`)
            if (!doc[key]) {
                span.style.display = 'none'
            }
            if (span) {
                span.textContent = `${key}: ${doc[key]}`
            }
        }

        const deleteBtn = clone.getElementById('delete-btn')
        deleteBtn.addEventListener('click', () => deleteWaterUsage(doc.id), false)
        parent.appendChild(clone)
    }
}

const main = async () => {
    const useTypes = await getAll('useTypes')
    const useTypeDict = useTypes.reduce((map, useType) => {
        map[useType.id] = useType.name
        return map
    }, {})

    const waterUsages = await getWaterUsage('day', getList)
    const data = waterUsages.map((waterUsage) => {
        waterUsage.updatedAt = waterUsage.updatedAt.toDate()
        waterUsage.createdAt = waterUsage.createdAt.toDate()
        waterUsage.useType = useTypeDict[waterUsage.useType_id]
        return waterUsage
    })

    insertHTML(data)
}

main()
