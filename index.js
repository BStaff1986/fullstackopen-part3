const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const getRandomId = () => {
    const MAX = 1000
    return Math.floor(Math.random() * MAX)
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const numberOfPersons = persons.length;
    
    response.send(
        `
        <p>Phonebook has info for ${numberOfPersons} people</p>
        <p>${currentDate} (${timeZone})</p>
        `
    )
})
app.post('/api/persons', (request, response) => {
    const body = request.body
    const newPerson = {
        id: getRandomId(),
        name: body.name,
        number: body.number
    }
    persons.concat(newPerson)
    response.json(body)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
}
)

const PORT = 3001;
app.listen(PORT)