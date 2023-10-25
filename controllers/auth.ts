import User from '../model/User.ts'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  // hashing the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Successfully registered as ${newUser.name}`, newUser })
}
