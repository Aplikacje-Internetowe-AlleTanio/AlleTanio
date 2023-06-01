import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../database';
import { handleRequest, TRequestData } from '../../utils/request.utils';
import postRateRoute from './post.rate';

describe('post.rate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should handle the request and create a new rating', async () => {
        const mockRequest = {
            body: {
                rating: 40,
                comment: 'great think',
                productId: 1,
            },
            userId: '123',
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const requestData: TRequestData<void> = {
            req: mockRequest as unknown as Request,
            res: mockResponse,
            execute: async () => postRateRoute.handler(mockRequest as unknown as Request, mockResponse),
            responseSuccessStatus: StatusCodes.CREATED,
            messages: {
                uniqueConstraintFailed: 'Product rating already exists.',
            },
        };

        await handleRequest(requestData);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(mockResponse.json).toMatchSnapshot();
    });
});
