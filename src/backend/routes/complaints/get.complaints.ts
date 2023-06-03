import { Request as ExpressRequest, Response } from 'express';
import { authorize } from '../../utils/middleware.utils';
import { TRequestData, handleRequest } from '../../utils/request.utils';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../database';
import { TRoute } from '../types';
import { Complaint } from '@prisma/client';

interface CustomRequest extends ExpressRequest {
    userId?: string
}

export default {
    method: 'get',
    path: '/api/complaints',
    validators: [authorize],
    handler: async (req: CustomRequest, res: Response) => 
        handleRequest<Complaint[]>({
            req,
            res,
            responseSuccessStatus: StatusCodes.OK,
            execute: async () => {
                const userId = req.userId

                const products = await prisma.product.findMany({
                    where: {
                        addedBy: userId,
                    },
                })
                const productIds = products.map((product) => product.id)
                const orders = await prisma.order.findMany({
                    where: {
                        productId: {in: productIds}
                    }
                })
                const orderIds = orders.map((order) => order.id)
                
                const complaints = await prisma.complaint.findMany({
                    where: {
                        orderId: {                            
                            in: orderIds
                        }
                    }
                })

                return complaints
            }
        })
} as TRoute