import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../database';
import { handleRequest, TRequestData } from '../../utils/request.utils';
import getProductsRoute from './get.products';

describe('get.products', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should handle the request and return products based on filters', async () => {
        const mockRequest = {
            query: {
                name: 'parufki',
                fastDelivery: 'true',
                price: '2137',
            },
        } as unknown as Request;
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const requestData: TRequestData<void> = {
            req: mockRequest,
            res: mockResponse,
            execute: async () => getProductsRoute.handler(mockRequest, mockResponse),
            responseSuccessStatus: StatusCodes.OK,
        };

        await handleRequest(requestData);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockResponse.json).toMatchSnapshot();
    });
});
