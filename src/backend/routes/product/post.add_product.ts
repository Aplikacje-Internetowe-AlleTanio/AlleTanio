import { Request as ExpressRequest, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'

interface CustomRequest extends ExpressRequest {
    userId?: string
}

export default {
    method: 'post',
    path: '/api/add_product',
    validators: [
        authorize,
        body('name').not().isEmpty(),
        body('description').not().isEmpty(),
        body('price').not().isEmpty().isFloat(),
        body('fastDelivery').not().isEmpty().isBoolean(),
        body('category').isString(),

    ],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            messages: {
                uniqueConstraintFailed: 'Product name must be unique.',
            },
            execute: async () => {
                const { name, description, price, fastDelivery, category } = req.body
                const userId = req.userId

                return await prisma.product.create({
                    data: {
                        addedBy: userId || undefined,
                        name,
                        description,
                        price,
                        fastDelivery,
                        category
                    } as any,
                })
            },
        }),
} as TRoute
