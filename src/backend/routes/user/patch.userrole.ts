import { Request as ExpressRequest, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'

interface CustomRequest extends ExpressRequest {
    userId?: string
    userRoleId?: number
}

export default {
    method: 'patch',
    path: '/api/userrole',
    validators: [
        authorize,
        body('username').not().isEmpty(),
        body('roleId').not().isEmpty().isInt(),
    ],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            messages: {},
            execute: async () => {
                const { username, roleId } = req.body

                const userRoleId = req.userRoleId
                console.log('id: ' + userRoleId)
                if (userRoleId !== 1) {
                    return res.sendStatus(StatusCodes.FORBIDDEN)
                }

                const user = await prisma.user.findUnique({
                    where: { username },
                })

                if (!user) {
                    return res.sendStatus(StatusCodes.NOT_FOUND)
                }

                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: { roleId },
                })

                return updatedUser
            },
        }),
} as TRoute
