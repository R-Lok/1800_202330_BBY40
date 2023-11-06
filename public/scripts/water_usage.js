const weeklyToggle = document.getElementById('weekly-label')
const monthlyToggle = document.getElementById('monthly-label')
const yearlyToggle = document.getElementById('yearly-label')

weeklyToggle.addEventListener("click", e => {
    weekly.style.display = "block"
    monthly.style.display = "none"
    yearly.style.display = "none"
})

monthlyToggle.addEventListener("click", e => {
    weekly.style.display = "none"
    monthly.style.display = "block"
    yearly.style.display = "none"
})

yearlyToggle.addEventListener("click", e => {
    weekly.style.display = "none"
    monthly.style.display = "none"
    yearly.style.display = "block"
})
//Below: charts
const yearly = document.getElementById('water-usage-chart-yearly')

new Chart(yearly, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Liters of water',
            data: [122, 195, 350, 225, 112, 333, 444, 450, 435, 322, 222, 345],
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

const weekly = document.getElementById('water-usage-chart-weekly')

new Chart(weekly, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Liters of water',
            data: [20, 22, 34, 55, 12, 15, 44],
            borderWidth: 1
        }],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        indexAxis: 'y',
        maintainAspectRatio: false
    },
})

const monthly = document.getElementById('water-usage-chart-monthly')

new Chart(monthly, {
    type: 'bar',
    data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        datasets: [{
            label: 'Liters of water',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            borderWidth: 1
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