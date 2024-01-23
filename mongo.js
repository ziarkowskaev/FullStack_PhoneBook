const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument and include name and phone number')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://ewelinaziarkowska:${password}@phonebook.1o46gbf.mongodb.net/Persons?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

//define person
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length>3){
//create person
const person = new Person({
    name: process.argv[3],
  number: process.argv[4],
})

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook!`)
    mongoose.connection.close()
  })}else{
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
  }