function sayHello() {
    
}
//sayHello();

var login = false
const loginFunction = () => {
    console.log(login)
    login = true
    console.log(login)
    alert("redirecting...")
    return window.location.href = "http://localhost:3000/main.html"
}
