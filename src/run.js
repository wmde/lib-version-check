// Built-Ins
const assert = require( 'assert' );

// 3rd Party
const semver = require( 'semver' );

// Internal
const { getLibVersion, parseEnvVars } = require('./helpers');

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
        return ['No remote libraries defined in package.json. Exiting...'];
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

module.exports = run;