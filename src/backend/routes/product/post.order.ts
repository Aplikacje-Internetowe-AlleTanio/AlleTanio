import { Request as ExpressRequest, Response } from 'express'
import { body } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../../database'
import { TRoute } from '../types'
import { handleRequest } from '../../utils/request.utils'
import { authorize } from '../../utils/middleware.utils'

interface CustomRequest extends ExpressRequest {
    userId?: string
}

export default {
    method: 'post',
    path: '/api/order',
    validators: [
        authorize,
        body('deliveryAddressId').not().isEmpty(),
    ],
    handler: async (req: CustomRequest, res: Response) =>
        handleRequest({
            req,
            res,
            responseSuccessStatus: StatusCodes.CREATED,
            messages: {
                uniqueConstraintFailed: 'Order creation failed.',
            },
            execute: async () => {
                const { deliveryAddressId, productId } = req.body;
                const userId = req.userId

                const deliveryAddress = await prisma.address.findUnique({
                    where: {
                        id: deliveryAddressId,
                    },
                    select: {
                        userId: true,
                    },
                });
    
                if (deliveryAddress?.userId !== userId) {
                    throw new Error('Delivery address does not belong to the logged-in user.');
                }
                
                const order = await prisma.order.create({
                    data: {
                        userId: userId || undefined,
                        deliveryAddressId,
                        productId,
                    } as any,
                });
                return order;
            },
        }),
} as TRoute

