import { body, param, query, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import User from '../model/User.ts'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customErrors.ts'
import { StatusCodes } from 'http-status-codes'
import Products from '../model/Products.ts'
import { Types } from 'mongoose'

export const validationMiddleware = (validate: any) => {
  return [
    validate,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((err) => err.msg) as any[string]
        if (errorMessages[0].startsWith('Cast')) {
          throw new NotFoundError('Invalid Product id')
        }
        throw new BadRequestError(errorMessages)
      }
      next()
    },
  ]
}

// REGISTER AND LOGIN

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
    .withMessage('invalid email')
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

export const validateLoginUser = validationMiddleware([
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('invalid email'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
])

// PRODUCTS

export const validateProduct = validationMiddleware([
  param('id').custom(async (id) => {
    const isValidMongoId = Types.ObjectId.isValid(id)

    const isProductAvailable = await Products.findById(id)

    if (!isValidMongoId) throw new BadRequestError('')

    if (!isProductAvailable) throw new NotFoundError('No product by that id')
  }),
])
