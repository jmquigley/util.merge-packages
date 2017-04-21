# util.mergePackages [![Build Status](https://travis-ci.org/jmquigley/util.mergePackage.svg?branch=master)](https://travis-ci.org/jmquigley/util.mergePackage) [![tslint code style](https://img.shields.io/badge/code_style-TSlint-5ed9c7.svg)](https://palantir.github.io/tslint/) [![Test Runner](https://img.shields.io/badge/testing-ava-blue.svg)](https://github.com/avajs/ava) [![NPM](https://img.shields.io/npm/v/util.mergePackage.svg)](https://www.npmjs.com/package/util.mergePackage) [![Coverage Status](https://coveralls.io/repos/github/jmquigley/util.mergePackage/badge.svg?branch=master)](https://coveralls.io/github/jmquigley/util.mergePackage?branch=master)

> Merges the contents of two package.json files

It attempts to combine two separate `package.json` files into one, respecting as much existing content as possible including already existing dependencies and `package.json` formatting.


## Installation

To install as an application dependency:
```
$ npm install --save util.mergePackages
```

To build the app and run all tests:
```
$ npm run all
```


## Usage

```javascript

import {merge} from 'util.mergePackages';

let dst = fs.readFileSync('package.a.json');
let src = fs.readFileSync('package.b.json');

// Create a new `package.json`
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

This module was inspired by the existing module @ https://github.com/izaakschroeder/package-merge.  This module uses typescript, creates typings, and adds it to an CI/CD process.
