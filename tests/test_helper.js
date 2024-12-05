const Person = require('../models/person')

const initialPersons = [
  {
    name: 'Matti Matikka',
    number: '12-345678',
  },
  {
    name: 'Liisa Lilliputti',
    number: '98-765432',
  },
]

const nonExistingId = async () => {
  const person = new Person({ name: 'willremovethissoon' })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map(person => person.toJSON())
}

module.exports = {
  initialPersons, nonExistingId, personsInDb
}