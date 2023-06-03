import { Request, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { v4 } from 'uuid'
import { Prisma } from '@prisma/client' // Import PrismaClientKnownRequestError
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { createHash } from '../../utils/hash.utils'

const SALT = (process.env.PASSWORD_SALT as string) ?? 'XYZ'
export default {
    method: 'post',
    path: '/api/register',
    validators: [
        body('username')
            .not()
            .isEmpty()
            .custom((value) => typeof value === 'string'),
        body('pwdhash')
            .not()
            .isEmpty()
            .matches(/(?=.*[A-Za-z])(?=.*\d).{8,}/)
            .custom((value) => typeof value === 'string'),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            messages: {
                uniqueConstraintFailed: 'Username must be unique.',
            },
            execute: async () => {
                const { username, pwdhash } = req.body
                const passwordHash = createHash(pwdhash, SALT)

                try {
                    return await prisma.user.create({
                        data: {
                            id: v4(),
                            username,
                            pwdhash: passwordHash,
                            createdDate: new Date(),
                            roleId: 1,
                        },
                    })
                } catch (error) {
                    if (
                        error instanceof Prisma.PrismaClientKnownRequestError &&
                        error.code === 'P2002'
                    ) {
                        return res
                            .status(StatusCodes.CONFLICT)
                            .send({ message: 'Username must be unique.' })
                    }
                    throw error
                }
            },
        }),
} as TRoute
