import { NextFunction, Request, Response } from 'express'
import { verifyToken } from './jwt.utils'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import jwt, { JwtPayload } from 'jsonwebtoken'

const SECRET = (process.env.TOKEN_SECRET as string) ?? 'XYZ'

interface CustomRequest extends Request {
    userId?: string
}

export const authorize = (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization
    const parsedToken = token?.replace('Bearer ', '')
    const result = verifyToken(parsedToken ?? '', SECRET)

    if (!token || !result.isValid) {
        res.send(StatusCodes.UNAUTHORIZED).json({
            errors: [ReasonPhrases.UNAUTHORIZED],
        })
    } else {
        const decodedToken = jwt.decode(token) as JwtPayload
        req.userId = decodedToken.id as string
        next()
    }
}
