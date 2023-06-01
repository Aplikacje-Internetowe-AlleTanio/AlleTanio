import { createHash, checkHash } from './hash.utils';

describe('hash.utils.ts', () => {
    const data = 'password';
    const salt = 'somesalt';
    const hash = '5011a7facb8efc9db6eb6c628f6f258869b0b3703cc1694b1269663d9b3fb089cfb3d6438cd2e7583e0e7034d9615e80cca055387bd74f5100eb85071beb029a';

    it('should create a hash', () => {
        const result = createHash(data, salt);

        expect(result).toEqual(hash);
    });

    it('should check the hash', () => {
        const result = checkHash(data, hash, salt);

        expect(result).toBe(true);
    });

    it('should return false for incorrect hash', () => {
        const incorrectHash = 'incorrecthash';
        const result = checkHash(data, incorrectHash, salt);

        expect(result).toBe(false);
    });
});
