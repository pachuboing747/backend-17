
const messagesEl = document.querySelector('#messages')
const inputElement = document.querySelector('.inputBox input')

console.log(new Date())

messagesEl.innerHTML = ""

const appendMessageElement = (user, time, msg) => {
  const div = document.createElement('div')
  div.classList.add('uk-width-1-1')
  div.innerHTML = `<span class="uk-label">${user} [${time}]</span> <span class="uk-margin-left">${msg}</span>`
  
  messagesEl.appendChild(div)

  setTimeout(() => {
    messagesEl.scrollTo(0, messages.scrollHeight);
  }, 250)
}

const appendUserActionElement = (user, joined) => {
  const div = document.createElement('div')
  div.classList.add('uk-width-1-1')
  div.classList.add('uk-flex')
  div.classList.add('joined')

  const type = joined ? 'success' : 'danger'
  const action = joined ? 'unio' : 'salio'

  div.innerHTML = `<span class="uk-label uk-label-${type}">${user} se ${action}</span>`

  messagesEl.appendChild(div)

  setTimeout(() => {
    messagesEl.scrollTo(0, messages.scrollHeight);
  }, 250)
}

let username = null
let currentMessages = []

socket.on('chat-messages', (messagesList) => {
  currentMessages = messagesList
})

const cookies = parseCookies()

if(cookies.user){
  username = cookies.user
  socket.emit("user", {user: username, action: true})

  for (const { user, datetime, text } of currentMessages) {
    appendMessageElement(user, datetime, text)
  }

  socket.on('chat-message', ({ user, datetime, text }) => {
    appendMessageElement(user, datetime, text)
  })

  socket.on('user', ({ user, action }) => {
    appendUserActionElement(user, action)
  })


  inputElement.addEventListener('keyup', ({ key, target }) => {
    if (key !== 'Enter') {
      return
    }

    const { value } = target

    if (!value) {
      return
    }

    const fecha = new Date()

    const msg = { user: username, datetime: fecha.toLocaleTimeString('en-US'), text: value }

    socket.emit('chat-message', msg)
    target.value = ""
    appendMessageElement(username, fecha.toLocaleTimeString('en-US'), value)
  })
}


function parseCookies() {
  return document.cookie
    .split(';')
    .reduce((obj, cookie) => {
      const keyValue = cookie.split('=')
      return {
        ...obj,
        [keyValue[0].trim()]: keyValue[1]
      }
    }, {})
}
