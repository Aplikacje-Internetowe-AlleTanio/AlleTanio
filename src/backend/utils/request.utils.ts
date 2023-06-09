import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { TPrismaErrorDescriptions } from './prisma.utils'
export type TRequestData<Entity> = {
    req: Request
    res: Response
    execute: () => Promise<Entity | Entity[]>
    responseSuccessStatus?: number
    responseFailStatus?: number
    messages?: TPrismaErrorDescriptions
}
export type TCustomError = {
    isCustomError: true
    status: number
    message: string
}
export const handleRequest = async <Entity>({
    req,
    res,
    execute,
    responseSuccessStatus,
    responseFailStatus,
}: TRequestData<Entity>) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res
            .status(responseFailStatus ?? StatusCodes.BAD_REQUEST)
            .json({ errors: errors.array() })
    }
    try {
        const result = await execute()
        res.status(responseSuccessStatus ?? StatusCodes.OK).json({
            data: result,
        })
    } catch (err) {}
}
