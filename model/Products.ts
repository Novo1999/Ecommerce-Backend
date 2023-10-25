import { Schema, model } from 'mongoose'

const ProductSchema = new Schema({
  name: String,
  brand: String,
  price: String,
  category: String,
  description: String,
  link: String,
})

export default model('Product', ProductSchema)
