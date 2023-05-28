import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { prisma } from '../../database'
import { checkPrismaError } from '../../utils'

export const postProduct: RequestHandler = async (req, res) => {
  const { addedBy, name, description, price, fastDelivery } = req.body

  try {
    const addedProduct = await prisma.product.create({
      data: {
		addedBy,
        name,
        description,
        price,
        fastDelivery,
      },
    })

    res.status(StatusCodes.CREATED)
    res.send(addedProduct)
  } catch (err) {
    console.error(err)
    const response = checkPrismaError(err, {
      uniqueConstraintFailed: 'Product name must be unique.',
    })
    res.status(response.status)
    res.send(response.message)
  }
}
