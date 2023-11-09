import mongoose from 'mongoose'

mongoose.connect('mongodb://127.0.0.1:27017/orders')
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
