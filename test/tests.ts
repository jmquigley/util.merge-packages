'use strict';

import test from 'ava';
import * as _ from 'lodash';
import * as path from 'path';
import {Fixture} from 'util.fixture';
import merge from '../index';
import {cleanup} from './helpers';

test.after.always.cb(t => {
	cleanup(path.basename(__filename), t);
});

test('Combine a regular package.json with a dependencies', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		fixture.read('complete.json'),
		fixture.read('dependencies.json')
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.is(pkg.dependencies.async, '^0.8.6');
		t.is(pkg.dependencies.cheese, '^1.1.2');
		t.is(pkg.dependencies.express, '^5.0.0');
		t.is(pkg.dependencies.bigpipe, 'bigpipe/pagelet#branch');
	} catch (err) {
		t.fail(err.message);
	}
});

test('Combine a regular package.json with an empty object', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		fixture.read('complete.json'),
		fixture.read('empty.json')
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.is(pkg.dependencies.async, '~0.8.0');
		t.is(pkg.dependencies.express, '4.2.x');
		t.is(pkg.dependencies.bigpipe, 'bigpipe/pagelet');
	} catch (err) {
		t.fail(err.message);
	}
});

test('Combine a regular package.json with a scripts section', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		fixture.read('complete.json'),
		fixture.read('scripts.json')
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.is(pkg.scripts.test, 'vows --spec --isolate');
		t.is(pkg.scripts.build, 'tsc -p .');
	} catch (err) {
		t.fail(err.message);
	}
});

test('Combine a regular package.json with empty scripts section', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		'{}',
		fixture.read('complete.json')
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.is(pkg.scripts.test, 'vows --spec --isolate');
	} catch (err) {
		t.fail(err.message);
	}
});

test('Combine a regular package.json with a keywords section', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		fixture.read('complete.json'),
		fixture.read('keywords.json')
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.deepEqual(pkg.keywords, ['nodejitsu', 'example', 'browsenpm', 'test']);
	} catch (err) {
		t.fail(err.message);
	}
});

test('Combine a regular package.json with empty keywords', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		'{}',
		fixture.read('complete.json')
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.deepEqual(pkg.keywords, ['nodejitsu', 'example', 'browsenpm']);
	} catch (err) {
		t.fail(err.message);
	}
});

test('Combine a regular package.json with itself and confirm no changes', t => {
	const fixture = new Fixture('basic');
	const complete = fixture.read('complete.json');
	const result = merge(
		fixture.read('complete.json'),
		fixture.read('complete.json')
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.true(_.isEqual(JSON.parse(complete), pkg));
	} catch (err) {
		t.fail(err.message);
	}
});

test('Test with passing JSON objects directly to the merge', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		JSON.parse(fixture.read('complete.json')),
		JSON.parse(fixture.read('keywords.json'))
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.deepEqual(pkg.keywords, ['nodejitsu', 'example', 'browsenpm', 'test']);
	} catch (err) {
		t.fail(err.message);
	}
});

test('Combining description and version from complete and partial', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		JSON.parse(fixture.read('complete.json')),
		JSON.parse(fixture.read('partial.json'))
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.is(pkg.dependencies.async, '~0.8.0');
		t.is(pkg.dependencies.express, '4.2.x');
		t.is(pkg.dependencies.bigpipe, 'bigpipe/pagelet');
		t.is(pkg.version, '10.3.1');
		t.is(pkg.description, 'An example module to illustrate the usage of a package.json');
	} catch (err) {
		t.fail(err.message);
	}
});

test('Combining empty destination with a partial JSON', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		'{}',
		JSON.parse(fixture.read('partial.json'))
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.is(pkg.version, '10.3.1');
		t.is(pkg.description, 'An example module to illustrate the usage of a package.json');
	} catch (err) {
		t.fail(err.message);
	}
});

test('Combine a regular package.json with a dependencies using Buffer objects', t => {
	const fixture = new Fixture('basic');
	const result = merge(
		new Buffer(fixture.read('complete.json')),
		new Buffer(fixture.read('dependencies.json'))
	);

	try {
		const pkg = JSON.parse(result);
		t.truthy(pkg);
		t.is(pkg.dependencies.async, '^0.8.6');
		t.is(pkg.dependencies.cheese, '^1.1.2');
		t.is(pkg.dependencies.express, '^5.0.0');
		t.is(pkg.dependencies.bigpipe, 'bigpipe/pagelet#branch');
	} catch (err) {
		t.fail(err.message);
	}
});
