import {
  ValidationChain,
  body,
  param,
  validationResult,
} from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import User from '../model/User.ts'
import { BadRequestError } from '../errors/customErrors.ts'
import { StatusCodes } from 'http-status-codes'

export const validationMiddleware = (validate: any) => {
  return [
    validate,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req)
      if (errors.isEmpty()) {
        return next()
      }
      const errorMessages = errors.array().map((err) => err.msg) as any[string]

      res.status(StatusCodes.BAD_REQUEST).json({ err: errorMessages })
      throw new BadRequestError(errorMessages)
    },
  ]
}

export const validateRegisterUser = validationMiddleware([
  body('name')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 40, min: 5 })
    .withMessage('Name must be between 5 and 40 characters'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('invalid emails')
    .custom(async (email) => {
      const isUserExist = await User.findOne({ email: email.toLowerCase() })
      if (isUserExist)
        throw new BadRequestError(
          'An user with the email address already exists'
        )
    }),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
])
