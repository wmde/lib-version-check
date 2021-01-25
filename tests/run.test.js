// Mocked Modules
jest.mock('require-from-url/sync');
const requireFromUrl = require( 'require-from-url/sync' );

// Built-Ins
const { AssertionError } = require('assert');

// Internal
const messages = require('../src/messages'); 

// System Under Test
const run = require('../src/run.js');

describe('run()', () => {
    // return the last part of the example url as the version
    requireFromUrl.mockImplementation(url => ({ version: url.split('/').slice(-1)[0] }))
    
    it('should return success messages when all library versions match', () => {
        const given = {
            dependencies: {
                'library': '^2.0.0',
                'another-library': '6.6.6'
            },
            config: {
                remoteVersion: {
                    'library': 'http://example.com/2.1.1',
                    'another-library': 'http://example.com/6.6.6'
                }
            }
        }

        const expected = Object.entries(given.config.remoteVersion)
            .map(([lib, remote]) => messages.success(lib, remote));
        
        const actual = run(given);

        expected.forEach(msg => expect(actual).toContain(msg));
    });

    it('should throw an error message when no configurations are defined', () => {
        const givens = {
            'no config': {},
            'no remote versions': { config: {}}
        }

        Object.values(givens).forEach(given => expect(() => run(given)).toThrow(new Error(messages.no_remotes)));
    });

    it('should throw an assertion error when a library version does not match', () => {
        const given = {
            dependencies: {
                'library': '^1.0.0'
            },
            config: {
                remoteVersion: {
                    'library': 'http://example.com/2.1.1'
                }
            }
        }

        expect(() => run(given)).toThrow(new AssertionError({
            message: messages.no_match('library', '2.1.1', '^1.0.0')
        }))
    });
    
    it('should throw an assertion error when a library is not defined as a dependency', () => {
        const given = {
            config: {
                remoteVersion: {
                    'library': 'http://example.com/2.1.1'
                }
            }
        }

        expect(() => run(given)).toThrow(new AssertionError({
            message: messages.not_dependency('library')
        }))
    });

    it('should throw an assertion error when a library does not have a version property', () => {
        // Return an object without a version
        requireFromUrl.mockImplementationOnce(() => ({}));

        const given = {
            dependencies: {
                'library': '^2.0.0'
            },
            config: {
                remoteVersion: {
                    'library': 'http://example.com/no-version'
                }
            }
        }

        expect(() => run(given)).toThrow(new AssertionError({
            message: messages.no_version('library')
        }))
    });
})