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
    path: '/api/address',
    validators: [
        authorize,
        body('name')
            .not()
            .isEmpty()
            .custom((value) => typeof value === 'string'),
        body('street')
            .not()
            .isEmpty()
            .custom((value) => typeof value === 'string'),
        body('number').not().isEmpty().isInt(),
        body('postalCode')
            .not()
            .isEmpty()
            .custom((value) => typeof value === 'string'),
        body('city')
            .not()
            .isEmpty()
            .custom((value) => typeof value === 'string'),
    ],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            execute: async () => {
                const { name, street, number, postalCode, city } = req.body
                const userId = req.userId

                return await prisma.address.create({
                    data: {
                        name,
                        street,
                        number: parseInt(number),
                        postalCode,
                        city,
                        userId: userId || undefined,
                    } as any,
                })
            },
        }),
} as TRoute
