const personsRouter = require('express').Router()
const Person = require('../models/person')

// personsRouter.get('/', (request, response) => {
//   Person.find({}).then(notes => {
//     response.json(notes)
//   })
// })

personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

// personsRouter.get('/:id', (request, response, next) => {
//   Person.findById(request.params.id)
//     .then(person => {
//       if (person) {
//         response.json(person)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })

personsRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// personsRouter.post('/', (request, response, next) => {
//   const body = request.body

//   const person = new Person({
//     name: body.name,
//     number: body.number,
//   })

//   person.save()
//     .then(savedPerson => {
//       response.status(201).json(savedPerson)
//     })
//     .catch(error => next(error))
// })

personsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    const savedPerson = await person.save()
    response.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

// personsRouter.delete('/:id', (request, response, next) => {
//   Person.findByIdAndDelete(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })
const iamjustsplittingthispart = null
// personsRouter.delete('/:id', async (request, response, next) => {
//   try {
//     await Person.findByIdAndDelete(request.params.id)
//     response.status(204).end()
//   } catch (error) {
//     next(error)
//   }
// })

personsRouter.delete('/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// personsRouter.put('/:id', (request, response, next) => {
//   const body = request.body

//   const person = {
//     name: body.name,
//     number: body.number,
//   }

//   Person.findByIdAndUpdate(request.params.id, person, { new: true })
//     .then(updatedPerson => {
//       response.json(updatedPerson)
//     })
//     .catch(error => next(error))
// })

personsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name: body.name, number: body.number },
      { new: true }
    )
    response.status(200).json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

module.exports = personsRouter