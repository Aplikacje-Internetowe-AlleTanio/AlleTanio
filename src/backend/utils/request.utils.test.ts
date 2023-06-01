import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { handleRequest } from './request.utils';

describe('handleRequest', () => {
    const mockRequest = {} as Request;
    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('should return success response if execution is successful', async () => {
        const mockExecute = jest.fn().mockResolvedValue('Success');

        await handleRequest({
            req: mockRequest,
            res: mockResponse,
            execute: mockExecute,
        });

        expect(mockExecute).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockResponse.json).toHaveBeenCalledWith({ data: 'Success' });
    });
});
