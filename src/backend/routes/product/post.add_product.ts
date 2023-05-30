import { Request, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'


export default {
    method: 'post',
    path: '/api/add_product',
    validators: [
        body('addedBy').not().isEmpty(),
        body('name').not().isEmpty(),
        body('description').not().isEmpty(),
        body('price').not().isEmpty(),
        body('fastDelivery').not().isEmpty(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            messages: {
                uniqueConstraintFailed: 'Product name must be unique.',
            },
            execute: async () => {
                const { addedBy, name, description, price, fastDelivery } = req.body
				
				
                return await prisma.product.create({
                    data: {
                        addedBy,
                        name,
                        description,
                        price,
                        fastDelivery,
                    },
                })
            },
        }),
} as TRoute
