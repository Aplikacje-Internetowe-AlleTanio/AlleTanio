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
    method: 'patch',
    path: '/api/user',
    validators: [
        authorize,
        body('username').not().isEmpty(),
        body('newUsername').not().isEmpty(),
    ],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            messages: {},
            execute: async () => {
                const { username, newUsername } = req.body

                const user = await prisma.user.findUnique({
                    where: { username },
                })

                if (!user) {
                    return res.sendStatus(StatusCodes.NOT_FOUND)
                }

                if (user.id != req.userId) {
                    return res.sendStatus(StatusCodes.FORBIDDEN)
                }

                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: { username: newUsername },
                })

                return updatedUser
            },
        }),
} as TRoute
