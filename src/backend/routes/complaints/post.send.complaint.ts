import { Request as ExpressRequest, Response } from 'express';
import { handleRequest } from '../../utils/request.utils';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../database';
import { TRoute } from '../types';
import { authorize } from '../../utils/middleware.utils';
import { body } from 'express-validator';

interface CustomRequest extends ExpressRequest {
    userId?: string 
}

export default {
    method: 'post',
    path: '/api/complaints/send',
    validators: [
        authorize,
        body('orderId').not().isEmpty(),
        body('content').not().isEmpty()
    ],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            execute: async () => {
                const { orderId, content } = req.body;
                const userId = req.userId

                const order = await prisma.order.findFirst({
                    where: {
                        id: orderId,
                        userId: userId
                    }
                })

                if (!order) {
                    return  res.status(StatusCodes.BAD_REQUEST)
                                .json({ error: "Order not found." });
                }

                const complaint = await prisma.complaint.create({
                    data: {
                        orderId: orderId,
                        content: content
                    } as any
                })

                return complaint                
            }
        })
    } as TRoute