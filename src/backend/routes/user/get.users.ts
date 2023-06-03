import { Request as ExpressRequest, Response } from "express";
import { authorize } from "../../utils/middleware.utils";
import { handleRequest } from "../../utils/request.utils";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { User } from "@prisma/client";

interface CustomRequest extends ExpressRequest {
    userId?: string
}

export default {
    method: 'get',
    path: '/api/users',
    validators: [authorize],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest<User[]>({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            execute: async () => {
                const { query } = req.body

                const users = await prisma.user.findMany({
                    where: {
                        username: query ? { contains: query.toString() } : undefined
                    }
                })

                return users
            }
        }) 
} as TRoute