import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'

interface FilterParams {
    name?: string
    description?: string
    price?: number
    fastDelivery?: boolean
}

export default {
    method: 'get',
    path: '/api/products',
    validators: [
        authorize,
        body('price').optional().isFloat(),
        body('fastDelivery').optional().isBoolean(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            execute: async () => {
                const filters: FilterParams = req.body

                const { name, description, price, fastDelivery } = filters

                const where: FilterParams = {}

                if (name) {
                    where.name = name
                }

                if (description) {
                    where.description = description
                }

                if (price !== undefined) {
                    where.price = Number(price)
                }

                if (fastDelivery !== undefined) {
                    where.fastDelivery = Boolean(fastDelivery)
                }

                return await prisma.product.findMany({
                    where,
                })
            },
        }),
} as TRoute
