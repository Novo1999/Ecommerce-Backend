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
import { BadRequestError } from '../errors/customErrors.ts'

const sortBy = (sort: string) => {
  switch (sort) {
    case 'a-z':
      return { name: 'asc' }
    case 'z-a':
      return { name: 'desc' }
    case 'price[a-z]':
      return { price: 'asc' }
    case 'price[z-a]':
      return { price: 'desc' }
    default:
      throw new BadRequestError('Wrong query')
  }
}

// when page loads
export const getAllProducts = async (req: Request, res: Response) => {
  let { sort } = req.query
  const products = await Products.find({}).sort(sortBy(sort as string) as any)
  res.status(StatusCodes.OK).json(products)
}

// when user clicks on a product, he can see that and also 3 related products
export const getSingleProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await Products.findById(id)

  const allProducts = await Products.find({})

  // product cant be same and have categories matched
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
  let { category, sort } = req.query

  // if no sort was provided, just sort by ascending order
  if (!sort) sort = 'asc'

  // sort by alphabetical order and by price

  // match categories with at least one common letter
  const products = await Products.find({
    category: { $regex: `.*${category}`, $options: 'i' },
  }).sort(sortBy(sort as string) as any)

  if (!products.length)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'No product by that category' })

  res.status(StatusCodes.OK).json(products)
}

export const sortByPrice = async (req: Request, res: Response) => {
  const { sort } = req.query
  const sortedProducts = await Products.find({}).sort({ price: sort as any })

  res.status(StatusCodes.OK).json(sortedProducts)
}
// export const sortByPrice = async (req: Request, res: Response) => {
//   const { sort } = req.query
//   const sortedProducts = await Products.find({}).sort({ price: sort as any })

//   res.status(StatusCodes.OK).json(sortedProducts)
// }
