const insertHTML = (docs) => {
    const parent = document.getElementById('water-usage-container')
    const temp = document.getElementById('template-waterlogs')

    for (const doc of docs) {
        const clone = temp.content.cloneNode(true)
        const div = clone.querySelector('div')
        div.id = doc.id
        const editBtn = clone.getElementById('edit-btn')
        editBtn.id = `${doc.id}-edit-btn`
        editBtn.setAttribute('data-target', `#${doc.useType}-modal`)

        const deleteBtn = clone.getElementById('delete-btn')
        deleteBtn.addEventListener('click', () => deleteWaterUsage(doc.id), false)

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

        div.appendChild(editBtn)
        div.appendChild(deleteBtn)
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
