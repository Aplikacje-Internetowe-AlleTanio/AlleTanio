import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../database';
import { handleRequest, TRequestData } from '../../utils/request.utils';
import postAddressRoute from './post.address';

describe('post.address', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should handle the request and create a new address', async () => {
        const mockRequest = {
            body: {
                name: 'Jan nNowak',
                street: 'Kutrzeby',
                number: '10',
                postalCode: '64-500',
                city: 'Poznan',
            },
            userId: '123',
        } as unknown as Request;
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const requestData: TRequestData<void> = {
            req: mockRequest,
            res: mockResponse,
            execute: async () => postAddressRoute.handler(mockRequest, mockResponse),
            responseSuccessStatus: StatusCodes.CREATED,
        };

        await handleRequest(requestData);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(mockResponse.json).toMatchSnapshot();
    });
});
