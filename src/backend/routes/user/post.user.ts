import crypto from 'crypto'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { v4 } from 'uuid'

import { prisma } from '../../database'
import { checkPrismaError } from '../../utils'

const SALT = (process.env.PASSWORD_SALT as string) ?? 'XYZ'
export const postUser: RequestHandler = async (req, res) => {
    const { username, pwdhash } = req.body
    const hash = crypto.createHmac('sha512', SALT)
    hash.update(pwdhash)
    const passwordHash = hash.digest('hex')

    try {
        const createdUser = await prisma.user.create({
            data: {
                id: v4(),
                username,
                pwdhash: passwordHash,
                createdDate: new Date(),
                roleId: 1,
            },
        })
        res.status(StatusCodes.CREATED)
        res.send({ ...createdUser, pwdhash: '***' })
    } catch (err) {
        console.error(err)
        const response = checkPrismaError(err, {
            uniqueConstraintFailed: 'Username must be unique.',
        })
        res.status(response.status)
        res.send(response.message)
    }
}
