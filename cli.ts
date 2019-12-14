#!/usr/bin/env node

//
// Command line that allows one to combine two package.json files together.
//
import * as fs from "fs-extra";
import {encoding, failure} from "util.constants";
import merge from "./index";

const yargs = require("yargs")
	.usage("Usage: $0 --out=out.json")
	.option("out", {
		alias: "o",
		default: "./out.json",
		describe: "The destination output JSON file",
		nargs: 1
	})
	.option("f1", {
		describe: "A package.json type file #1 to merge",
		nargs: 1
	})
	.option("f2", {
		describe: "A package.json type file #2 to merge",
		nargs: 1
	})
	.demandOption(["out", "f1", "f2"])
	.version()
	.help()
	.showHelpOnFail(false, "Specify --help for available options")
	.example(
		"pkgmerge --out=./out.json --f1=test/fixtures/basic/complete.json --f2=test/fixtures/basic/dependencies.json",
		"Basic example that shows how to run an existing test fixutre and create an output file."
	).argv;

function getFile(filename: string) {
	if (fs.existsSync(filename)) {
		return fs.readFileSync(filename, encoding);
	} else {
		console.error(`${filename} does not exits`);
		process.exit(failure);
		return "";
	}
}

const f1 = getFile(yargs.f1);
const f2 = getFile(yargs.f2);

fs.writeFileSync(yargs.out, merge(f1, f2));
if (fs.existsSync(yargs.out)) {
	console.log(`Created ${yargs.out}`);
}
