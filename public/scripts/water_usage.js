const water_usage_chart = () => {
    const ctx = document.getElementById('water-usage-chart')

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Liters used',
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
        },
        responsive: true
    })
}

water_usage_chart()
