import User from '../model/User.ts'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { NotFoundError, UnauthenticatedError } from '../errors/customErrors.ts'
import { createJwt } from '../utils/tokenUtil.ts'

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

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) throw new NotFoundError('User not found')

  const passwordIsMatched = await bcrypt.compare(password, user.password!)

  if (!passwordIsMatched) throw new UnauthenticatedError('invalid credentials')

  // signing jwt token
  const token = createJwt({ userId: user._id.toString(), email: user.email! })

  // sending cookie
  res.cookie('token', token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })

  res.status(StatusCodes.OK).json({ msg: `Welcome ${user.name}` })
}

export const logoutUser = async (_: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}
