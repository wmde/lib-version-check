# Lib Version Check

A small utility to check remote library versions against a local dependency entry.

## Usage

* Install

    ```bash
    npm i lib-version-check
    ```

* Add remote library urls to your `package.json`

    ```js
    {
        // ...
        "config": {
            "remoteVersion": {
                // <package-name>: <remote>
                "vue": "https://raw.githubusercontent.com/wikimedia/mediawiki/master/resources/lib/vue/vue.common.prod.js",
            }
        }
    }
    ```

* Run in a directory that contains your `package.json`

    ```bash
    lib-version-check
    ```

* Add a script to your `package.json`, to run anywhere within your project

    ```js
    {
        // ...
        "scripts": {
            "check-versions": "lib-version-check"
        }
    }
    ```


