const express = require('express')
const morgan = require('morgan')
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => { 
   return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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


    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Missing name or number"
        })
    }

    const matchedNameCount = persons.filter(person => person.name === body.name).length

    if (matchedNameCount > 0) {
        return response.status(400).json({
            error: "Must use unique name"
        })
    }

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})