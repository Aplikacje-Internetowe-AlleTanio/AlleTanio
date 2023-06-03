import { Request as ExpressRequest, Response } from 'express'
import { body } from 'express-validator'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'
import { TRoute } from '../types'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'

interface CustomRequest extends ExpressRequest {
    userId: string
}

async function GetUserByName(name: string): Promise<string> {
    const user = await prisma.user.findFirst({ where: { username: name } });

    if (!user) {
        throw new Error('User not found');
    }

    return user.id;
}

export default {
    method: 'post',
    path: '/api/messages/send',
    validators: [
        authorize,
        body('recipient').not().isEmpty(),
        body('title').not().isEmpty(),
        body('content').not().isEmpty(),
    ],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            execute: async () => {
                const { recipient, title, content } = req.body
                const fromUserId = req.userId
                const toUserId = await GetUserByName(recipient)

                if (!toUserId) {
                    return  res.status(StatusCodes.BAD_REQUEST)
                                .json({ error: 'Recipient not found' });
                }

                return await prisma.message.create({
                    data: {
                        fromUserId,
                        toUserId,
                        title,
                        content,
                    } as any,
                })
            },
        }),
} as TRoute
