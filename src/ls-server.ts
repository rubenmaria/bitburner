/** @param {NS} ns */

import * as util from "new/util.js"


const border = {
	topBody: `─`,
	topJoin: `┬`,
	topLeft: `┌`,
	topRight: `┐`,

	bottomBody: `─`,
	bottomJoin: `┴`,
	bottomLeft: `└`,
	bottomRight: `┘`,

	bodyLeft: `│`,
	bodyRight: `│`,
	bodyJoin: `│`,

	joinBody: `─`,
	joinLeft: `├`,
	joinRight: `┤`,
	joinJoin: `┼`
};


export async function main(ns:NS): Promise<void> {
	const hostnames = util.getServerList(ns);
	for (const hostname of hostnames) {
    ns.tprint(hostname);
	}
	ns.tprint(border.topLeft + border.topBody.repeat(4) + border.topRight)
	ns.tprint(border.bodyRight + " PE " + border.bodyLeft)
	ns.tprint(border.joinLeft + border.bottomBody.repeat(4) + border.joinRight);
	ns.tprint(border.bodyRight + " PE " + border.bodyLeft)
	ns.tprint(border.bottomLeft + border.bottomBody.repeat(4) + border.bottomRight)

	const data = [
		['Penis', 'was', 'geht'],
		['1A', '1B', '1C'],
		['2A', '2B', '2C'],
		["hure", "macht", "aahh"]
	];

	tprintTable(ns, data)
}


function tprintTable(ns, data, padding=1) {
	assertValidTable(data);
	ns.tprint(getMaxEntryLength(data));
	printTopBar(ns, data, padding);
	for(let row = 0; row < data.length; row++) {
		printRowEntries(ns, data, data[row], padding);
		if(row < data.length - 1) {
			printVerticalSeperator(ns, data, padding);
		}
	}
	printBottomBar(ns, data, padding);
}


function assertValidTable(data) {
	util.assert(data.length > 0, "Empty data was given!");
	const columnLength = data[0].length;
	for(let row = 1; row < data.length; row++) {
		util.assert(data[row].length == columnLength, "Invalid row length!");
	}
}

function printRowEntries(ns, data, row, padding) {
	const paddingString = " ".repeat(padding);
	const entryLength = getMaxEntryLength(data);
	const fillerString = (x) => " ".repeat(entryLength - x.length);
	const entryString = row
		.map((x) => paddingString + x + fillerString(x) + paddingString)
		.join(border.bodyJoin);
	ns.tprint(border.bodyLeft + entryString + border.bodyRight);
}

function printVerticalSeperator(ns, data, padding) {
	const rowEntriesAmount = data[0].length;
	const charsPerEntry = getMaxEntryLength(data) + padding * 2;
	const entryString = border.joinBody.repeat(charsPerEntry);
	const entries = (entryString + border.joinJoin).repeat(rowEntriesAmount - 1) + entryString
	ns.tprint(border.joinLeft + entries + border.joinRight);
}

function printTopBar(ns, data, padding) {
	const charsPerEntry = getMaxEntryLength(data) + padding * 2;
	const entryString = border.topBody.repeat(charsPerEntry);
	const rowEntriesAmount = data[0].length;
	const entries = (entryString + border.topJoin).repeat(rowEntriesAmount - 1) + entryString
	ns.tprint(border.topLeft + entries + border.topRight);
}

function printBottomBar(ns, data, padding) {
	const charsPerEntry = getMaxEntryLength(data) + padding * 2;
	const entryString = border.topBody.repeat(charsPerEntry);
	const rowEntriesAmount = data[0].length;
	const entries = (entryString + border.bottomJoin).repeat(rowEntriesAmount - 1) + entryString
	ns.tprint(border.bottomLeft + entries + border.bottomRight);
}

function getMaxEntryLength(data) {
	return Math.max(... _.flatten(data).map((x) => x.length));
}
