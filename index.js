require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require("cors")
const PhoneNumber = require('./models/person')
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    PhoneNumber.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response) => {
    PhoneNumber.findById(request.params.id).then(person => {
        response.json(person)
    })
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
    /* Temp turn off
    //const matchedNameCount = persons.filter(person => person.name === body.name).length

    if (matchedNameCount > 0) {
        return response.status(400).json({
            error: "Must use unique name"
        })
    }
    */
    const number = new PhoneNumber({
        name: body.name,
        number: body.number
    })
    
    number.save().then(savedNumber => {
        response.json(savedNumber)        
    })

})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})