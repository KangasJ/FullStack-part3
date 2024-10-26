require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))

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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.get('/api/persons', (request, response) => { //tehtävä 3.13
    Person.find({})
      .then(persons => response.json(persons))
      .catch(error => next(error))
})

app.post('/api/persons', (request, response) => { //tehtävä 3.14
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({error: 'name or number missing'});
  }

  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({error: 'name must be unique'});
    }

    const person = new Person({
      name: body.name,
      number: body.number
    });

    person.save()
    .then(savedPerson => {response.json(savedPerson)
    .catch(error => next(error))
    });
  });
});

app.get('/api/persons/:id', (request, response) => { //tehtävä 3.18
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => { //tehtävä 3.15
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => { //tehtävä 3.17
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'Name and number are required' });
  }

  const person = { name, number };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error))
});

app.get('/info', (request, response) => { //tehtävä 3.18
  Person.countDocuments({})
      .then(numberOfPersons => {
          const currentTime = new Date();
          response.send(
              `<p>Phonebook has numbers for ${numberOfPersons} people</p>
               <p>${currentTime}</p>`
          );
      })
      .catch(error => next(error))
});

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})