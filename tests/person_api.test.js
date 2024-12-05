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

  const contents = response.body.map(r => r.name)

  assert.strictEqual(response.body.length, helper.initialPersons.length + 1)

  assert(contents.includes('Kalle Kissa'))
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



after(async () => {
  await mongoose.connection.close()
})