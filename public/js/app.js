console.log('Client side javascript file is loaded!')

const weatherForm = document.querySelector('form')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', ev => {
    ev.preventDefault()

    messageOne.textContent = 'Loading data...'
    messageOne.className = ''
    messageTwo.textContent = ''
    messageTwo.className = ''

    const location = ev.target.elements[0].value

    fetch('/weather?address=' + location)
        .then(response => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code:', response.status)
            } else {
                response.json().then(data => {
                    if (data.error) {
                        messageOne.textContent = data.error
                        messageOne.className = 'error'
                    } else {
                        messageOne.textContent = data.location
                        messageOne.className = 'success'
                        messageTwo.textContent = data.forecast
                        messageTwo.className = 'success'
                    }
                })
            }
        }).catch(error => {
            console.log('Fetch Error :-S', error)
        });
})