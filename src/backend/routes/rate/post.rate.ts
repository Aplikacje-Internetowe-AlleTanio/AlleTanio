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
    path: '/api/rate',
    validators: [
        authorize,
        body('rating').isInt({ min: 1, max: 5 }),
        body('comment').not().isEmpty(),
        body('productId').isInt(),
    ],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            messages: {
                uniqueConstraintFailed: 'Product rating already exists.',
            },
            execute: async () => {
                const { rating, comment, productId } = req.body
                const userId = req.userId
                
                const existingRating = await prisma.rating.findFirst({
                    where: {
                        productId: parseInt(productId),
                        addedBy: userId || undefined,
                    },
                })

                if (existingRating) {
                    throw new Error('You have already rated this product.')
                }

                return await prisma.rating.create({
                    data: {
                        rating,
                        comment,
                        addedBy: userId || undefined,
                        productId,
                    } as any,
                })
            },
        }),
} as TRoute
