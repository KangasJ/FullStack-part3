const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({ //tehtävä 3.19
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: { // tehtävä 3.20
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function(value) {
        const phoneRegex = /^\d{2,3}-\d{5,}$/
        return phoneRegex.test(value)
      }
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)