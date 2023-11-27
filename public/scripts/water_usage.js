const getChartConfig = (data, labels) => {
    const userTheme = localStorage.getItem('theme')
    let gridLineColor = 'rgba(0, 0, 0, 0.1)'
    let textColor = '#666'

    if (userTheme === 'true') {
        gridLineColor = 'rgba(239, 239, 239, 0.2)'
        textColor = 'rgba(232,230,226, 1.0)'
    }

    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `${getSystemString()} of water`,
                data: data,
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        text: 'Day/Date/Month',
                        display: true,
                        color: textColor
                    },
                    grid: {
                        color: gridLineColor,
                    },
                    ticks: {
                        color: 'rgba(232,230,226, 1.0)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: `Vol of Water Used (${getSystemString()})`,
                        color: textColor
                    },
                    grid: {
                        color: gridLineColor,
                    },
                    ticks: {
                        color: textColor
                    }
                },
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            indexAxis: 'y',
            maintainAspectRatio: false,
        },
    }
}

const main = async () => {
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

    monthlyToggle.addEventListener('click', async (e) => {
        weekly.style.display = 'none'
        monthly.style.display = 'block'
        yearly.style.display = 'none'
        const monthlyData = await getWaterUsage('month', getSum)
        // console.log(monthlyData)
        new Chart(monthly, getChartConfig(monthlyData, Array.from({ length: daysInMonth(new Date()) }, (v, i) => i + 1)))
    })

    yearlyToggle.addEventListener('click', async (e) => {
        weekly.style.display = 'none'
        monthly.style.display = 'none'
        yearly.style.display = 'block'
        const yearlyData = await getWaterUsage('year', getSum)
        // console.log(yearlyData)
        new Chart(yearly, getChartConfig(yearlyData, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']))
    })

    const weeklyData = await getWaterUsage('week', getSum)
    // console.log(weeklyData)
    new Chart(weekly, getChartConfig(weeklyData, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']))
}

main()
