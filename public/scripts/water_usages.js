const insertHTML = (docs) => {
    const parent = document.getElementById('water-usage-container')
    for (const doc of docs) {
        const div = document.createElement('div')
        div.id = doc.id
        div.classList.add('d-flex')
        div.classList.add('flex-column')
        let html = ''
        html += `<span>id: ${doc.id}</span>`
        html += `<span>use type: ${doc.useType}</span>`
        if (doc.machine_type) {
            html += `<span>machine type: ${doc.machine_type}</span>`
        }
        html += `<span>home: ${doc.home}</span>`
        html += `<span>est vol: ${doc.estVol} litre</span>`
        html += `<span>est cost: $ ${doc.estCost}</span>`
        html += `<span>updated at: ${doc.updatedAt}</span>`
        html += `<span>created at: ${doc.createdAt}</span>`
        div.innerHTML = html
        parent.appendChild(div)

        const editBtn = document.createElement('button')
        editBtn.textContent = 'Edit'
        editBtn.addEventListener('click', () => updateWaterUsage(doc.id), false)
        div.appendChild(editBtn)

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Delete'
        deleteBtn.addEventListener('click', () => deleteWaterUsage(doc.id), false)
        div.appendChild(deleteBtn)
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
