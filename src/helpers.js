// 3rd Party
const requireFromUrl = require( 'require-from-url/sync' );

/**
 * Interpolates environment variables within a string
 * 
 * @param {string} raw
 * @returns {string}
 */
function parseEnvVars(raw){
    // Uppercase, Lowercase, Digits and underscore between `#{}`
    const pattern = /#{([0-9A-Za-z_]+)}/g

    return raw.replace(pattern, (match, varName) => process.env[varName] || match);
}

/**
 * Requires library from external source and attempts to return a version number
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
        throw new Error(`Error while requiring library from ${libUrl}. ${e}`);
    }
}


module.exports = {
    getLibVersion,
    parseEnvVars
}