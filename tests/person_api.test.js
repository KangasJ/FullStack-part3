const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Person = require('../models/person')
const helper = require('./test_helper')
const api = supertest(app)


beforeEach(async () => {
  await Person.deleteMany({})

  let noteObject = new Person(helper.initialPersons[0])
  await noteObject.save()

  noteObject = new Person(helper.initialPersons[1])
  await noteObject.save()
})

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two persons', async () => {
  const response = await api.get('/api/persons')

  assert.strictEqual(response.body.length, helper.initialPersons.length)
})

test('the first person is Matti', async () => {
  const response = await api.get('/api/persons')

  const names = response.body.map(e => e.name)
  assert(names.includes('Matti Matikka'))
})

test('a valid person can be added ', async () => {
  const newPerson = {
    name: 'Kalle Kissa',
    number: '75-35649',
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/persons')

  const names = response.body.map(r => r.name)

  assert.strictEqual(response.body.length, helper.initialPersons.length + 1)

  assert(names.includes('Kalle Kissa'))
})

test('person without name is not added', async () => {
  const newPerson = {
    number: '12-345687'
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(400)

  const response = await api.get('/api/persons')

  assert.strictEqual(response.body.length, helper.initialPersons.length)
})

test('first person can be deleted', async () => {
  const personsAtStart = await api.get('/api/persons')
  const personToDelete = personsAtStart.body[0]

  await api
    .delete(`/api/persons/${personToDelete.id}`)
    .expect(204)

  const personsAtEnd = await api.get('/api/persons')

  assert.strictEqual(personsAtEnd.body.length, helper.initialPersons.length -1)
})

test('a persons information can be updated', async () => {
  const personsAtStart = await api.get('/api/persons')
  const personToUpdate = personsAtStart.body[0]

  const newPerson = {
    name: personToUpdate.name,
    number: '123-456789',
  }

  const response = await api
    .put(`/api/persons/${personToUpdate.id}`)
    .send(newPerson)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.number, newPerson.number)

  const personsAtEnd = await api.get('/api/persons')
  const updated = personsAtEnd.body.find(p => p.id === personToUpdate.id)
  assert.strictEqual(updated.number, newPerson.number)
})


after(async () => {
  await mongoose.connection.close()
})