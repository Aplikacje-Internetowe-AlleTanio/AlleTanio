import { Request, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest, TCustomError } from '../../utils/request.utils'
import { createHash } from '../../utils/hash.utils'
import { createToken } from '../../utils/jwt.utils'
const SALT = (process.env.PASSWORD_SALT as string) ?? 'XYZ'
const SECRET = (process.env.TOKEN_SECRET as string) ?? 'XYZ'
export default {
    method: 'get',
    path: '/api/login',
    validators: [
        body('username').not().isEmpty(),
        body('pwdhash').not().isEmpty(),
    ],
    handler: async (req: Request, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            responseFailStatus: StatusCodes.UNAUTHORIZED,
            execute: async () => {
                const { username, pwdhash } = req.body
                const passwordHash = createHash(pwdhash, SALT)
                const user = await prisma.user.findFirst({
                    where: { username },
                })
                const passwordValid = user
                    ? user.pwdhash === passwordHash
                    : false
                if (!user || !passwordValid)
                    throw {
                        status: StatusCodes.UNAUTHORIZED,
                        message: ReasonPhrases.UNAUTHORIZED,
                        isCustomError: true,
                    } as TCustomError
                return {
                    token: createToken(user, SECRET, '7d'),
                }
            },
        }),
} as TRoute