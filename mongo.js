const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

let isNewPhoneNumber = false;

if (process.argv.length === 5) {
    console.log('Begin new phone number process')
    isNewPhoneNumber = true;
}

const password = process.argv[2]
const url = `mongodb+srv://bstaff:${password}@fullstackopen.j9t6h5g.mongodb.net/?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery',false)
mongoose.connect(url)



const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhoneNumber = mongoose.model('PhoneNumber', phoneNumberSchema)

if (isNewPhoneNumber) {
const newName = process.argv[3]
const newNumber = process.argv[4]

const number = new PhoneNumber({
  name: newName,
  number: newNumber,
})

number.save().then(result => {
  console.log('Phone number saved!')
  mongoose.connection.close()
})
} else {
PhoneNumber.find({}).then(result => {
    console.log("Phonebook: ");
    result.forEach(note => {
      //console.log(note)
      console.log(note.name, note.number);
    })
    mongoose.connection.close()
  })
}