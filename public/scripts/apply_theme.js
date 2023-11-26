const applyTheme = () => {
    if (localStorage.getItem('theme') === 'true') {
        document.getElementById('main_css').href = './styles/dark_mode.css'
    } else {
        document.getElementById('main_css').href = './styles/style.css'
    }
}

applyTheme()
