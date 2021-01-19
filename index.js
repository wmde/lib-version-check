#!/usr/bin/env node

// Built-Ins
const process = require( 'process' );
const assert = require( 'assert' );

// 3rd Party
const semver = require( 'semver' );
const requireFromUrl = require( 'require-from-url/sync' );

// Internal
const packageJson = require( process.cwd() + '/package.json' );


function parseEnvVars(rawURL){
    // Uppercase, Lowercase, Digits and underscore between `#{}`
    const pattern = /#{([0-9A-Za-z_]+)}/g

    return rawURL.replace(pattern, (match, varName) => process.env[varName] || match);
}

/**
 * Requires library from external source ant attempts to return a version number
 * string
 *
 * @param {string} libUrl
 * @returns {string}  
 */
function getLibVersion(libUrl){
    try {
        const remoteLib = requireFromUrl( libUrl );
        return remoteLib.version;
    } catch (e) {
        console.error(
            `Error while requiring library from ${libUrl}:`,
            e.message
        );
        process.exit(1);
    }
}

/**
 * Asserts that any configured library has a version key, is listed as a dependency
 * and that it's remote url matches the semver requirements from package.json
 * 
 * @param {object} packageJson
 * @returns {string}
 */
function run(packageJson){
    if ( !('config' in packageJson)
        || !('remoteVersion' in packageJson.config)
    ) { 
        console.warn('No remote libraries defined in package.json. Exiting...');
        process.exit();
    }

    return Object.keys( packageJson.config.remoteVersion )
        .map(lib => {
            const libUrl = parseEnvVars(packageJson.config.remoteVersion[lib])
            const remoteVersion = getLibVersion(libUrl);
            const localRange = (packageJson.dependencies && packageJson.dependencies[lib]) || (packageJson.devDependencies && packageJson.devDependencies[lib]);
    
            assert(remoteVersion, `${lib} does not have a version key to check against.`);
            assert(localRange, `${lib} is not defined as a dependency of this package.`);
            assert(semver.satisfies( remoteVersion, localRange ), `${remoteVersion} does not match ${localRange}.` );
    
           return `Local version of ${lib} is in the same version range as ${libUrl}`;
        })
}

try {
    const output = run(packageJson);
    console.log(`${output.join('\n')}`);
} catch (e) {
    console.error(e.message);
    process.exit(1)
}
