#!/usr/bin/env node

// Internal
const packageJson = require( process.cwd() + '/package.json' );
const run = require('./src/run');

try {
    const output = run(packageJson);
    console.log(`${output.join('\n')}`);
} catch (e) {
    console.error(e.message);
    process.exit(1)
}
