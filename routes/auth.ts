import { Router } from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/auth.ts'
import {
  validateLoginUser,
  validateRegisterUser,
} from '../middleware/validationMiddleware.ts'

const router = Router()

router
  .post('/register', validateRegisterUser, registerUser)
  .get('/login', validateLoginUser, loginUser)
  .get('/logout', logoutUser)

export default router
