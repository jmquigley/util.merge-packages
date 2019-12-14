# util.merge-packages

> Merges the contents of two package.json files

[![build](https://github.com/jmquigley/util.merge-packages/workflows/build/badge.svg)](https://github.com/jmquigley/util.merge-packages/actions)
[![analysis](https://img.shields.io/badge/analysis-tslint-9cf.svg)](https://palantir.github.io/tslint/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![testing](https://img.shields.io/badge/testing-jest-blue.svg)](https://facebook.github.io/jest/)
[![NPM](https://img.shields.io/npm/v/util.merge-packages.svg)](https://www.npmjs.com/package/util.merge-packages)

It attempts to combine two separate `package.json` files into one, respecting as much existing content as possible including already existing dependencies and `package.json` formatting.

## Installation

This module uses [yarn](https://yarnpkg.com/en/) to manage dependencies and run scripts for development.

To install as an application dependency:
```
$ yarn add --dev util.merge-packages
```

To install globally (for the CLI):
```
$ yarn global add util.merge-packages
```

To build the app and run all tests:
```
$ yarn run all
```


## Usage

```javascript

import {merge} from 'util.mergePackages';

let dst = fs.readFileSync('package.a.json');
let src = fs.readFileSync('package.b.json');

// Create a new `package.json` as a string
console.log(merge(dst, src));
```

It allows you to do things like define scripts or dependencies that you would like to include as part of a larger project.

Merging:

```json
{
    "name": "my-package",
    "dependencies": {
        "babel": "^5.2.2",
        "lodash": "^3.2.5"
    }
}
```

```json
{
    "dependencies": {
        "babel": "^5.4.1",
        "eslint": "^0.22.1"
    }
}
```

results in:

```json
{
    "name": "my-package",
    "dependencies": {
        "babel": "^5.4.1",
        "lodash": "^3.2.5",
        "eslint": "^0.22.1"
    }
}
```


## CLI
The tool installs a command line version of this library to a program named ``pkgmerge``.  It uses the following options:

```
pkgmerge --out={filename}|./out.json --f1={file1.json} --f2={file2.json}
```

This will take file2.json (f2), merge it into file1.json (f1) and save the output to the filename given in the ``--out`` parameter.


This module was inspired by the existing module @ https://github.com/izaakschroeder/package-merge.  This module uses [Typescript](https://www.typescriptlang.org/), creates typings, uses the [ava test runner](https://github.com/avajs/ava), and adds it to the [Travis CI/CD](https://travis-ci.org/) process.
