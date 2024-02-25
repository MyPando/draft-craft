import { Request, Response } from "express";

/**
 * Description of an individual draft
 */
type Draft = {
  // number of rounds that the creater of the draft has said to play
  numRounds: number;
  // list of drafters
  drafters: Array<string>;
  // total number of picks that have occurred
  numPicks: number;
  // list of remaining options that drafters can pick from
  remaining: Array<string>,
  // list of options that drafters have picked
  picked: Array<string>,
  // list of drafters in the order that they have picked
  drafterOrder: Array<string>;
}

const drafts: Draft[] = [];

/**
 * Creates (adds) a new draft to a list of drafts,
 * returns the added draft
 */
export function create(req: Request, res: Response) {
  const rounds = parseInt(req.body.rounds);
  if (rounds === undefined || typeof rounds !== "number") {
    res.status(400).send("missing 'rounds' parameter");
    return;
  }

  const drafters = req.body.drafters;
  if (drafters === undefined || !Array.isArray(drafters)) {
    res.status(400).send("missing 'options' parameter");
    return;
  }

  const options = req.body.options;
  if (options === undefined || !Array.isArray(options)) {
    res.status(400).send("missing 'options' parameter");
    return;
  }

  const id = drafts.push({
    numRounds: rounds,
    drafters: drafters,
    numPicks: 0,
    remaining: options,
    picked: [],
    drafterOrder: []}) - 1;

  res.json({contents: drafts[id], id: id});
}

/**
 * Joins (gets) the draft at the id (index) of a list of drafts
 */
export function join(req: Request, res: Response) {
  const stringID = req.query.name;
  if (stringID === undefined || typeof stringID !== 'string') {
    res.status(400).send("missing 'id' parameter");
    return;
  }

  const id = parseInt(stringID);
  if (id < 0 || id >= drafts.length) {
    res.json({valid: false});
  } else {
    res.json({valid: true, contents: drafts[id], id: id});
  };
}

/**
 * Updates the list of drafts when a user picks an option,
 * returns the updated draft
 */
export function pick(req: Request, res: Response) {
  const id = parseInt(req.body.id);
  if (id === undefined || typeof id !== 'number') {
    res.status(400).send("missing 'id' parameter");
    return;
  }

  const pick = req.body.pick;
  if (pick === undefined || typeof pick !== 'string') {
    res.status(400).send("missing 'pick' parameter");
    return;
  }

  const drafter = req.body.drafter;
  if (drafter === undefined || typeof drafter !== 'string') {
    res.status(400).send("missing 'drafter' parameter");
    return;
  }

  let draft = drafts[id];
  const indexPick = draft.remaining.indexOf(pick);
  // update number of picks, remaining, picked, and drafter order lists
  draft.numPicks = draft.numPicks + 1;
  draft.remaining.splice(indexPick, 1);
  draft.picked.push(pick);
  draft.drafterOrder.push(drafter);

  res.json({contents: draft});
}

/**
 * Returns a draft from a list of drafts
 */
export function refresh(req: Request, res: Response) {
  const stringID = req.query.name;
  if (stringID === undefined || typeof stringID !== 'string') {
    res.status(400).send("missing 'id' parameter");
    return;
  }
  const id = parseInt(stringID);

  res.json({contents: drafts[id]});
}

/**
 * Removes all created drafts from a list of drafts
 */
export function reset() {
  drafts.splice(0, drafts.length);
}
