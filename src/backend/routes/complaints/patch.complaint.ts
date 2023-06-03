import { Request as ExpressRequest, Response } from "express"
import { authorize } from "../../utils/middleware.utils"
import { handleRequest } from "../../utils/request.utils"
import { prisma } from "../../database"
import { StatusCodes } from "http-status-codes"
import { TRoute } from "../types"

interface CustomRequest extends ExpressRequest {
    userId?: string
}

export default {
    method: 'patch',
    path: '/api/complaints/:complaintId',
    validators: [authorize],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            execute: async () => {
                const { complaintId } = req.params
                const userId = req.userId

                const user = await prisma.user.findUnique({
                    where: {
                        id: userId
                    }
                })

                if (!user || user.roleId !== 0) {
                    return  res.status(StatusCodes.FORBIDDEN)
                                .json({ error: "Access denied." })
                }

                return await prisma.complaint.update({
                    where: {
                        id: complaintId
                    },
                    data: {
                        refund: true
                    }
                })
            }
        })
} as TRoute