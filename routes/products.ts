import { Router } from 'express'
import {
  getAllProducts,
  getProductByCategory,
  getSingleProduct,
} from '../controllers/products.ts'
import { validateProduct } from '../middleware/validationMiddleware.ts'

const router = Router()

router
  .get('/', getAllProducts)
  .get('/product/:id', validateProduct, getSingleProduct)
  .get('/product?:category', getProductByCategory)

export default router
