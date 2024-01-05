const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()


const Person = require('./models/persons')

app.use(express.static('dist'))
app.use(express.json())

app.use(cors())
// create "middleware"


//3.16
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
  
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  

let persons = [
]

//3.18
app.get('/info', async (request, response) => {
    const num = await Person.countDocuments({})
    const date = new Date().toString()
    response.send(`<p>Phonebook has info for ${num} people</p></br><p>${date}</p>`)
  })

//3.13 
app.get('/api/persons', (request, response) => {

    Person.find({}).then(result => {
        response.json(result)
        })
        
})

//3.14
app.post('/api/persons', (request, response, next) => {

    const body = request.body

    const person = new Person({
        name: body.name, 
        number: body.number
    })
  
    person.save()
        .then(result => {
            console.log(`added ${person.name} number ${person.number} to phonebook!`)
            response.json(result)
      })
      .catch(error => next(error))
  })


//3.18
app.get('/api/persons/:id', (request, response, next) => {

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

//3.15 
app.delete('/api/persons/:id', (request, response,next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
            })
            .catch(error => next(error))
})


  //3.17
  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
        name: body.name, 
        number: body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

    app.use(unknownEndpoint)
    app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

