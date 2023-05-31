import { Request as ExpressRequest, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'

interface CustomRequest extends ExpressRequest {
    userId?: string
}

export default {
    method: 'get',
    path: '/api/rating/:productId',
    validators: [
        authorize,
    ],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            execute: async () => {
                const { productId } = req.params

                const ratings = await prisma.rating.findMany({
                    where: {
                        productId: parseInt(productId),
                    },
                })

                return ratings
            },
        }),
} as TRoute
