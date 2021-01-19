#!/usr/bin/env node

// Built-Ins
const { AssertionError } = require( 'assert');

// Internal
const packageJson = require( process.cwd() + '/package.json' );
const run = require('./src/run');

try {
    const output = run(packageJson);
    console.log(`${output.join('\n')}`);
} catch (e) {
    if (e instanceof AssertionError) {
        console.error(`Assertion failed: ${e.message}`);
        process.exit(1);
    }

    throw e;
}
