/* 
1. Get all products
2. Get a single product
3. Filter by category
4. Sort by price (low - high / high - low) / Alphabetical order (A - Z / Z - A)
5. 
*/

import { Request, Response } from 'express'
import Products from '../model/Products.ts'
import { StatusCodes } from 'http-status-codes'

// when page loads
export const getAllProducts = async (_: Request, res: Response) => {
  const products = await Products.find({})
  res.status(StatusCodes.OK).json(products)
}

// when user clicks on a product, he can see that and also 3 related products
export const getSingleProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await Products.findById(id)

  const allProducts = await Products.find({})

  let relatedProducts = allProducts.filter(
    (item) => item.id !== product?.id && item.category === product?.category
  )

  if (relatedProducts.length > 3) relatedProducts = relatedProducts.slice(0, 3)

  res.status(StatusCodes.OK).json({
    product,
    relatedProducts: relatedProducts.length === 0 ? 'none' : relatedProducts,
  })
}

// user chooses category from dropdown or types in url
export const getProductByCategory = async (req: Request, res: Response) => {
  const { category } = req.query

  // match categories with at least one common letter

  const products = await Products.find({
    category: { $regex: `.*${category}`, $options: 'i' },
  })

  if (!products.length)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'No product by that category' })

  console.log(category, products)
  res.status(StatusCodes.OK).json(products)
}
