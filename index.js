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
    PhoneNumber.find({})
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    PhoneNumber.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    PhoneNumber.find({})
        .then(result => {
            const numberOfPersons = result.length.toString();
            response.send(
                `
                <p>Phonebook has info for ${numberOfPersons} people</p>
                <p>${currentDate} (${timeZone})</p>
                `
            )
        })
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

    number.save()
        .then(savedNumber => {
            response.json(savedNumber)
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    }

    PhoneNumber.findByIdAndUpdate(request.params.id, person, { "new": true })
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    PhoneNumber.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            next(error);
        })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: "Malformatted id" })
    }
}

app.use(errorHandler)