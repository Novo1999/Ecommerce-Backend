import { Router } from 'express'
import { registerUser } from '../controllers/auth.ts'
import { validateRegisterUser } from '../middleware/validationMiddleware.ts'

const router = Router()

router.post('/register', validateRegisterUser, registerUser)

export default router
