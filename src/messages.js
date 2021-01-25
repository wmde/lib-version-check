module.exports = {
    success: (lib, url) => `Local version of ${lib} is in the same version range as ${url}`,
    no_version: (lib) => `${lib} does not have a version key to check against.`,
    not_dependency: (lib) => `${lib} is not defined as a dependency of this package.`,
    no_match: (lib, version, range) => `${lib} ${version} does not match ${range}.`,
    not_required: (url, error) => `Error while requiring library from ${url}. ${error}`,
    no_remotes: 'No remote libraries defined in package.json. Exiting...'
}