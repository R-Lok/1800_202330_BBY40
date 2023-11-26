const getChartConfig = (data, labels) => {
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
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: `Vol of Water Used (${getSystemString()})`,
                    },
                },
            },
            indexAxis: 'y',
            maintainAspectRatio: false,
        },
    }
}

const makeCharts = ({ weeklyData, monthlyData, yearlyData }) => {
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

    new Chart(weekly, getChartConfig(weeklyData, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']))
    new Chart(monthly, getChartConfig(monthlyData, Array.from({ length: daysInMonth(new Date()) }, (v, i) => i + 1)))
    new Chart(yearly, getChartConfig(yearlyData, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']))
}

const main = async () => {
    const [weeklyData, monthlyData, yearlyData] = await Promise.all([
        getWaterUsage('week', getSum),
        getWaterUsage('month', getSum),
        getWaterUsage('year', getSum),
    ])
    // console.log(weeklyData)
    // console.log(monthlyData)
    // console.log(yearlyData)
    makeCharts({ weeklyData, monthlyData, yearlyData })
}

main()
