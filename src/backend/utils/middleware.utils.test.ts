import { Request, Response, NextFunction } from 'express';
import { authorize } from './middleware.utils';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { verifyToken } from './jwt.utils'; // Dodaj ten import


jest.mock('./jwt.utils', () => ({
    verifyToken: jest.fn(),
}));

describe('Authorization Middleware', () => {
    const mockRequest = {} as CustomRequest;
    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return UNAUTHORIZED if no token is provided', () => {
        mockRequest.headers = {}; // Add headers object to mockRequest
        authorize(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: [ReasonPhrases.UNAUTHORIZED],
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return UNAUTHORIZED if token is invalid', () => {
        const invalidToken = 'invalidtoken';
        mockRequest.headers = {
            authorization: `Bearer ${invalidToken}`,
        };
        (verifyToken as jest.Mock).mockReturnValue({ isValid: false }); // Mock verifyToken to return invalid result

        authorize(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: [ReasonPhrases.UNAUTHORIZED],
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
});

interface CustomRequest extends Request {
    userId?: string;
    userRoleId?: number;
}
