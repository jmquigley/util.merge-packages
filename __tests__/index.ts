import * as _ from "lodash";
import * as path from "path";
import {cleanup, Fixture} from "util.fixture";
import merge from "../index";

afterAll((done) => {
	cleanup({done, message: path.basename(__filename)});
});

test("Combine a regular package.json with a dependencies", () => {
	const fixture = new Fixture("basic");
	const result = merge(
		fixture.read("complete.json"),
		fixture.read("dependencies.json")
	);

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.dependencies.async).toBe("^0.8.6");
		expect(pkg.dependencies.cheese).toBe("^1.1.2");
		expect(pkg.dependencies.express).toBe("^5.0.0");
		expect(pkg.dependencies.bigpipe).toBe("bigpipe/pagelet#branch");
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Combine a regular package.json with an empty object", () => {
	const fixture = new Fixture("basic");
	const result = merge(
		fixture.read("complete.json"),
		fixture.read("empty.json")
	);

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.dependencies.async).toBe("~0.8.0");
		expect(pkg.dependencies.express).toBe("4.2.x");
		expect(pkg.dependencies.bigpipe).toBe("bigpipe/pagelet");
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Combine a regular package.json with a scripts section", () => {
	const fixture = new Fixture("basic");
	const result = merge(
		fixture.read("complete.json"),
		fixture.read("scripts.json")
	);

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.scripts.test).toBe("vows --spec --isolate");
		expect(pkg.scripts.build).toBe("tsc -p .");
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Combine a regular package.json with empty scripts section", () => {
	const fixture = new Fixture("basic");
	const result = merge("{}", fixture.read("complete.json"));

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.scripts.test).toBe("vows --spec --isolate");
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Combine a regular package.json with a keywords section", () => {
	const fixture = new Fixture("basic");
	const result = merge(
		fixture.read("complete.json"),
		fixture.read("keywords.json")
	);

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.keywords).toEqual([
			"nodejitsu",
			"example",
			"browsenpm",
			"test"
		]);
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Combine a regular package.json with empty keywords", () => {
	const fixture = new Fixture("basic");
	const result = merge("{}", fixture.read("complete.json"));

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.keywords).toEqual(["nodejitsu", "example", "browsenpm"]);
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Combine a regular package.json with itself and confirm no changes", () => {
	const fixture = new Fixture("basic");
	const complete = fixture.read("complete.json");
	const result = merge(
		fixture.read("complete.json"),
		fixture.read("complete.json")
	);

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(_.isEqual(JSON.parse(complete), pkg)).toBe(true);
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Test with passing JSON objects directly to the merge", () => {
	const fixture = new Fixture("basic");
	const result = merge(
		JSON.parse(fixture.read("complete.json")),
		JSON.parse(fixture.read("keywords.json"))
	);

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.keywords).toEqual([
			"nodejitsu",
			"example",
			"browsenpm",
			"test"
		]);
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Combining description and version from complete and partial", () => {
	const fixture = new Fixture("basic");
	const result = merge(
		JSON.parse(fixture.read("complete.json")),
		JSON.parse(fixture.read("partial.json"))
	);

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.dependencies.async).toBe("~0.8.0");
		expect(pkg.dependencies.express).toBe("4.2.x");
		expect(pkg.dependencies.bigpipe).toBe("bigpipe/pagelet");
		expect(pkg.version).toBe("10.3.1");
		expect(pkg.description).toBe(
			"An example module to illustrate the usage of a package.json"
		);
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Combining empty destination with a partial JSON", () => {
	const fixture = new Fixture("basic");
	const result = merge("{}", JSON.parse(fixture.read("partial.json")));

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.version).toBe("10.3.1");
		expect(pkg.description).toBe(
			"An example module to illustrate the usage of a package.json"
		);
	} catch (err) {
		throw new Error(err.message);
	}
});

test("Combine a regular package.json with a dependencies using Buffer objects", () => {
	const fixture = new Fixture("basic");
	const result = merge(
		new Buffer.from(fixture.read("complete.json")),
		new Buffer.from(fixture.read("dependencies.json"))
	);

	try {
		const pkg = JSON.parse(result);
		expect(pkg).toBeDefined();
		expect(pkg.dependencies.async).toBe("^0.8.6");
		expect(pkg.dependencies.cheese).toBe("^1.1.2");
		expect(pkg.dependencies.express).toBe("^5.0.0");
		expect(pkg.dependencies.bigpipe).toBe("bigpipe/pagelet#branch");
	} catch (err) {
		throw new Error(err.message);
	}
});
