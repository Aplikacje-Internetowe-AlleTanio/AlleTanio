import { createToken, verifyToken } from './jwt.utils';

describe("jwt.utils", () => {
    const payload = { userId: '2137' };
    const secret = 'secretKey';
    const expiresIn = '1h';

    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('02-04-2005'));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create a token', () => {
        const result = createToken(payload, secret, expiresIn);

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
    });

    it('should return false for invalid token', () => {
        const invalidToken = 'invalidtoken';
        const result = verifyToken(invalidToken, secret);

        expect(result.isValid).toBe(false);
        expect(result.content).toEqual({});
    });
});
