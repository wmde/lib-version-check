// Built-Ins
const assert = require( 'assert' );

// 3rd Party
const semver = require( 'semver' );

// Internal
const { getLibVersion, parseEnvVars } = require('./helpers');
const messages = require('./messages');

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
        throw new Error(messages.no_remotes);
    }

    return Object.keys( packageJson.config.remoteVersion )
        .map(lib => {
            const libUrl = parseEnvVars(packageJson.config.remoteVersion[lib])
            const remoteVersion = getLibVersion(libUrl);
            const localRange = (packageJson.dependencies && packageJson.dependencies[lib]) || (packageJson.devDependencies && packageJson.devDependencies[lib]);
    
            assert(remoteVersion, messages.no_version(lib));
            assert(localRange, messages.not_dependency(lib));
            assert(semver.satisfies( remoteVersion, localRange ), messages.no_match(lib, remoteVersion, localRange) );
    
            return messages.success(lib, libUrl);
        })
}

module.exports = run;