import { Request as ExpressRequest, Response } from 'express';
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { TRoute } from '../types'
import { prisma } from '../../database'
import { StatusCodes } from 'http-status-codes'
import { Message } from '@prisma/client';

interface CustomRequest extends ExpressRequest {
    userId?: string
}

export default {
    method: 'get',
    path: '/api/messages',
    validators: [authorize],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest<Message[]>({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            execute: async () => {
                const userId = req.userId

                const messages = await prisma.message.findMany({
                    where: {
                        toUserId: userId,
                    },
                })

                return messages
            },
        }),
} as TRoute
