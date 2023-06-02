import { Request as ExpressRequest, Response } from "express";
import { authorize } from "../../utils/middleware.utils";
import { handleRequest } from "../../utils/request.utils";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";

interface CustomRequest extends ExpressRequest {
    userId?: string
}

export default {
    method: 'get',
    path: '/api/searchuser',
    validators: [authorize],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            execute: async () => {
                const query = req.query

                if (!query) {
                    return  res.status(StatusCodes.BAD_REQUEST)
                                .json({ error: "Query parameter 'username' required." })
                }

                const users = await prisma.user.findMany({
                    where: {
                        username: { contains: query.toString() }
                    }
                })

                return users
            }
        }) 
} as TRoute