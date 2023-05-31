import { Request, Response } from 'express'
import { query, validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'

export default {
    method: 'get',
    path: '/api/products',
    validators: [
        authorize,
        query('name').optional().not().isEmpty(),
        query('fastDelivery').optional().isBoolean(),
        query('price').optional().isNumeric(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            execute: async () => {
                const { name, fastDelivery, price } = req.query

                let filters = {}

                if (name) {
                    filters = { ...filters, name: String(name) }
                }

                if (fastDelivery !== undefined) {
                    filters = {
                        ...filters,
                        fastDelivery: Boolean(fastDelivery),
                    }
                }

                if (price) {
                    filters = { ...filters, price: Number(price) }
                }

                return await prisma.product.findMany({
                    where: filters,
                })
            },
        }),
} as TRoute
