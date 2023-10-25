import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
})

// delete the password in the response
UserSchema.methods.toJSON = function () {
  let user = this.toObject()
  delete user.password
  return user
}

export default model('User', UserSchema)
