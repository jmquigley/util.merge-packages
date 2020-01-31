import * as _ from "lodash";
import * as semver from "semver";
import {encoding} from "util.constants";

const json = require("jju");
const intersect = require("semver-intersect").intersect;

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
	return _.isEmpty(dst)
		? src
		: Object.assign(
				{},
				dst,
				_.mapValues(src, (version, dep) => {
					// We need to check if both are indeed semver ranges in order to do
					// intersects – some may be git urls or other such things.
					const isSem =
						semver.validRange(version) &&
						semver.validRange(dst[dep]);
					if (isSem){
						try {
							return intersect(version, dst[dep]);
						} catch (_) {
							return version;
						}
					} else {
						return version;
					}
				})
		  );
}

function combine(dst: any, src: any) {
	return _.isEmpty(dst)
		? src
		: Object.assign(
				{},
				dst,
				_.mapValues(src, (value, key) => {
					return _.has(handlers, key)
						? handlers[key](dst[key], value)
						: value;
				})
		  );
}

/**
 * Takes two input objects and attempts to merge them together.  This function
 * should be used for package.json files.  This function will take special care
 * to merge dependencies (and their versions), scripts, and keyword sections
 * of the package.json file.
 * @param dst {string|Buffer|object} the target object for the merge
 * @param src {string|Buffer|object} the source object for the merge
 * @returns {string} a merged object string in JSON format.
 */
export default function merge(
	dst: string | Buffer | object,
	src: string | Buffer | object
) {
	let odst = dst;

	if (dst instanceof Buffer) {
		dst = dst.toString(encoding);
	}

	if (src instanceof Buffer) {
		src = src.toString(encoding);
	}

	if (typeof dst === "object") {
		odst = JSON.stringify(dst);
	}

	if (typeof dst === "string") {
		dst = JSON.parse(dst);
	}

	if (typeof src === "string") {
		src = JSON.parse(src);
	}

	if (_.isEqual(dst, src)) {
		return odst;
	}

	return json.update(odst, combine(dst, src), {});
}
