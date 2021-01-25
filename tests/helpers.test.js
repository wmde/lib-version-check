// Mocked Modules
jest.mock('require-from-url/sync');
const requireFromUrl = require( 'require-from-url/sync' );

// System Under Test
const { parseEnvVars, getLibVersion } = require('../src/helpers.js');

describe('parseEnvVars()', () => {
    const OLD_ENV = process.env;
    const SOME_ENV_VAR = 'test';

    beforeAll(() => {
        // adds \ overrides SOME_ENV_VAR for the tests
        process.env = {
            SOME_ENV_VAR,
            ...OLD_ENV
        }

        // deletes NON_EXISTENT env var is it exists
        delete process.env.NON_EXISTENT;

        jest.resetModules();
    });
    
    afterAll(() => {
        process.env = OLD_ENV;
    });

    it('should interpolate environment variables', () => {
        const actual = parseEnvVars('http://example.com/#{SOME_ENV_VAR}/more');
        const expected = `http://example.com/${SOME_ENV_VAR}/more`

        expect(actual).toBe(expected);
    });

    it('should ignore non existing environment variable interpolation', () => {
        const actual = parseEnvVars('http://example.com/#{NON_EXISTENT}/more');
        const expected = 'http://example.com/#{NON_EXISTENT}/more';

        expect(actual).toBe(expected);
    });
});

describe('getLibVersion()', () => {
    it('should return library version from url', () => {
        const expected = '2.0'

        requireFromUrl.mockReturnValue({
            version: expected
        });

        expect(getLibVersion('http://example.com/path/')).toBe(expected);
    });

    it('should return undefined if library does not have a version property', () => {
        requireFromUrl.mockReturnValue({});

        expect(getLibVersion('http://example.com/path/')).toBeUndefined();
    });

    it('should throw errors with url when retrieval fails', () => {
        const url = 'http://example.com/path/';
        
        requireFromUrl.mockImplementationOnce(() => {
            throw new Error('Some Error');
        });

        expect(() => getLibVersion(url)).toThrow(url);
    });
});
