import { Request, Response } from 'express'
import route from './get.status'

describe('GET /api/status', () => {
    const mockReq = {} as Request
    const mockRes = {
        send: jest.fn(),
    } as unknown as Response

    it("should respond with 'I'm alive!'", async () => {
        await route.handler(mockReq, mockRes)

        expect(mockRes.send).toHaveBeenCalledWith("I'm alive!")
    })
})
