require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))
const Person = require('./models/person')

const url = process.env.MONGODB_URI;

// let persons = [
//     {
//         id: "1",
//         name:"Arto Hellas",
//         number:"040-123456"
//     },
//     {
//         id:"2",
//         name:"Ada Lovelace",
//         number:"39-44-5323523"
//     },
//     {
//         id:"3",
//         name:"Dan Abramov",
//         number:"12-43-234345"
//     },
//     {
//         id:"4",
//         name:"Mary Poppendieck",
//         number:"39-23-6423122"
//     }
// ]

morgan.token('data', function (req, res) { return JSON.stringify(req.body) }) // tehtävä 3.8
app.use(morgan(':method :url :status :res[content-lenght] - :response-time ms  :data'))

app.use(morgan('tiny')) //tehtävä 3.7

// app.get('/api/persons', (request, response) => { //tehtävä 3.1
//     response.json(persons)
// })

// app.get('/info', (request, response) => { //tehtävä 3.2
//     const numberOfPersons = persons.length
//     const currentTime = new Date()
    
//     response.send(
//       `<p>Phonebook has numbers for ${numberOfPersons} people</p>
//        <p>${currentTime}</p>`
//     )
// })
// app.get('/api/persons/:id', (request, response) => { //tehtävä 3.3
//     const id = request.params.id
//     const person = persons.find(person => person.id === id)

//     if (person) {
//         response.json(person)
//     } else {
//         response.status(404).end()
//     }
// })

// app.delete('/api/persons/:id', (request, response) => { //tehtävä 3.4
//     const id = request.params.id
//     persons = persons.filter(person => person.id !== id)

//     response.status(204).end()
// })

// app.post('/api/persons', (request, response) => { // tehtävä 3.5 ja 3.6
//     const body = request.body

//     if (!body.name || !body.number) {
//         return response.status(400).json({
//             error: 'name or number missing'
//         })
//     }

//     const personExists = persons.some(person => person.name === body.name)
//     if (personExists) {
//         return response.status(400).json({
//             error: 'name must be unique'
//         })
//     }

//     const person = {
//         id: generateId(),
//         name: body.name,
//         number: body.number,
//     }
//     persons = persons.concat(person)
//     response.json(person)
// })

const generateId = () => { //chatGPTn tarjoamana 
    let newId
    do {
      newId = Math.floor(Math.random() * 10000) // Generoi satunnainen numero
    } while (persons.some(person => person.id === String(newId))) // Tarkista, ettei ID ole jo käytössä
    return String(newId) // Palauta ID merkkijonona
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    });
  }

  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique'
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number
    });

    person.save().then(savedPerson => {
      response.json(savedPerson);
    });
  });
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
})



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})