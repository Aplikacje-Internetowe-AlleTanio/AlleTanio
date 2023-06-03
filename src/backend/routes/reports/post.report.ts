import { Request as ExpressRequest, Response } from 'express'
import { authorize } from '../../utils/middleware.utils'
import { handleRequest } from '../../utils/request.utils'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'
import { body } from 'express-validator'
import { TRoute } from '../types'

interface CustomRequest extends ExpressRequest {
    userId?: string
}

export default {
    method: 'post',
    path: '/api/reports/send',
    validators: [
        authorize,
        body('productId').not().isEmpty(),
        body('content').not().isEmpty()
    ],
    handler: async (req: CustomRequest, res: Response) => 
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            responseFailStatus: StatusCodes.NO_CONTENT,
            execute: async () => {
                const { productId, content } = req.body
                const reportedBy = req.userId

                return await prisma.report.create({
                    data: {
                        productId,
                        reportedBy: reportedBy || undefined,
                        content
                    } as any
                })
            }
        })
} as TRoute