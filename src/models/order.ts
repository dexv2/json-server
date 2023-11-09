import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true,
        unique: true
    },
    customer: {
        type: String,
        required: true
    },
    product: {
        name: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        }
    },
    fileName: {
        type: String,
        required: true
    }
})

export default mongoose.model('Order', orderSchema)
