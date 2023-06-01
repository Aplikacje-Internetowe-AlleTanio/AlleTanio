import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../database';
import { handleRequest, TRequestData } from '../../utils/request.utils';
import getRatingRoute from './get.rating';

describe('get.rating', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should handle the request and return ratings for the given product', async () => {
        const productId = '123';
        const mockRequest = {
            params: {
                productId,
            },
        } as unknown as Request;
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const requestData: TRequestData<void> = {
            req: mockRequest,
            res: mockResponse,
            execute: async () => getRatingRoute.handler(mockRequest, mockResponse),
            responseSuccessStatus: StatusCodes.OK,
        };

        await handleRequest(requestData);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockResponse.json).toMatchSnapshot();
    });
});
