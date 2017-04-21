'use strict';

import * as _ from 'lodash';
import * as semver from 'semver';

const json = require('jju');
const intersect = require('semver-set').intersect;

const handlers = {
	keywords: unique,

	scripts: exists,

	dependencies: updateDependencies,
	devDependencies: updateDependencies,
	peerDependencies: updateDependencies
};

function exists(dst: any, src: any) {
	return Object.assign({}, dst, src);
}

function unique(dst: string[] = [], src: string[] = []) {
	const set = new Set(dst);
	src.forEach((it: string) => {
		set.add(it);
	});

	return Array.from(set);
}

function updateDependencies(dst: any, src: any) {
	return _.isEmpty(dst) ? src : Object.assign({}, dst, _.mapValues(src, (version, dep) => {
		// We need to check if both are indeed semver ranges in order to do
		// intersects – some may be git urls or other such things.
		const isSem = semver.validRange(version) && semver.validRange(dst[dep]);
		return isSem ? intersect(version, dst[dep]) || version : version;
	}));
}

function combine(dst: any, src: any) {
	return _.isEmpty(dst) ? src : Object.assign({}, dst, _.mapValues(src, (value, key) => {
		return _.has(handlers, key) ? handlers[key](dst[key], value) : value;
	}));
}

export default function merge(dst: string | object, src: string | object) {
	let odst = dst;
	if (typeof dst === 'object') {
		odst = JSON.stringify(dst);
	}

	if (typeof dst === 'string') {
		dst = JSON.parse(dst);
	}

	if (typeof src === 'string') {
		src = JSON.parse(src);
	}

	if (_.isEqual(dst, src)) {
		return odst;
	}

	return json.update(odst, combine(dst, src), {});
}
