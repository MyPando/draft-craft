import React, { Component, ChangeEvent } from "react";

interface AppState {
  // start or draft screen
  page: string;

  // input drafter
  drafter: string;
  // input id
  inputID: number;
  // valid or invalid id
  validID: boolean;
  // id of draft
  id: number;
  // number of rounds
  rounds: number;
  // valid or invalid number of rounds
  validRounds: boolean;
  // input options
  options: string;
  // input drafters
  drafters: string;

  // total number of picks that have occurred
  numPicks: number;
  // wait or pick screen
  turnPick: string;
  // input pick
  inputPick: string;
  // list of remaining options that drafters can pick from
  remainingOptions: Array<string>;
  // list of options that drafters have picked
  pickedOptions: Array<string>;
  // list of drafters in the order that they have picked
  drafterOrder: Array<string>;
}

export class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);

    this.state = {
      page: "start",

      drafter: "",
      inputID: 0,
      validID: true,
      id: 0,
      rounds: 0,
      validRounds: true,
      options: "",
      drafters: "",

      numPicks: 0,
      turnPick: "",
      inputPick: "default",
      remainingOptions: [],
      pickedOptions: [],
      drafterOrder: [],
    };
  }

  render = (): JSX.Element => {
    if (this.state.page === "start") {
      // start screen

      // check if id or rounds is valid
      if (!this.state.validID) {
        return(
          <div>
            <p>Error: Invalid input draft ID</p>
          </div>
        )
      } else if (!this.state.validRounds) {
        return (
          <div>
            <p>Error: Invalid input number of rounds</p>
            <p>The number of rounds must be non-negative and less than the number of options
               needed for each drafter to pick once per round.</p>
          </div>
        )
      }

      return (
        <div>
          <div>
            <label htmlFor="drafter">Drafter: </label>
            <input id="drafter" type="text"
                   value={this.state.drafter} onChange={this.handleDrafter}></input>
            <label htmlFor="drafter"> (required for either join or create)</label>
          </div>

          <h2>Join Existing Draft</h2>

          <div>
            <label htmlFor="input-ID">Draft ID: </label>
            <input id="input-ID" type="number" min={1}
                   value={this.state.inputID} onChange={this.handleInputID}></input>
            <label htmlFor="draft-ID"> </label>

            <button type="button" onClick={this.handleJoin}>Join</button>
          </div>

          <h2>Create New Draft</h2>

          <div>
            <label htmlFor="rounds">Rounds: </label>
            <input id="rounds" type="number" min={1}
                   value={this.state.rounds} onChange={this.handleRounds}></input>
          </div>

          <br></br>

          <label htmlFor="options">Options (one per line)</label>

          <div>
            <div >
              <textarea id="options" rows={10} cols={50}
                        value={this.state.options} onChange={this.handleOptions}></textarea>
            </div>
          </div>

          <br></br>

          <label htmlFor="drafters"> Drafters (one per line, in order)</label>

          <div>
            <div>
              <textarea id="drafters" rows={10} cols={50}
                        value={this.state.drafters} onChange={this.handleDrafters}></textarea>
            </div>
          </div>

          <button type="button" onClick={this.handleCreate}>Create</button>
        </div>
      )
    } else {
      // draft screen

      // make drop down of remaining options
      const remainingDropDown: JSX.Element[] = [];
      remainingDropDown.push(
        <option key="default" value="default">Select an option</option>
      )
      for (const option of this.state.remainingOptions) {
        remainingDropDown.push(
          <option key={option} value={option}>{option}</option>
        );
      }

      // make draft status table
      const status: JSX.Element[] = [];
      // no picks
      if (this.state.pickedOptions.length === 0) {
        status.push(
          <tbody key={0}>
            <tr>
              <td>No picks made yet.</td>
            </tr>
          </tbody>
        )
      // some picks
      } else {
        status.push(
          <tbody key={0}>
            <tr>
              <td><b>Num</b></td>
              <td><b>Pick</b></td>
              <td><b>Drafter</b></td>
            </tr>
          </tbody>
        );
        for (let i = 0; i < this.state.pickedOptions.length; i++) {
          status.push(
            <tbody key={i + 1}>
              <tr>
                <td>{i + 1}</td>
                <td>{this.state.pickedOptions[i]}</td>
                <td>{this.state.drafterOrder[i]}</td>
              </tr>
            </tbody>
          );
        }
      };

      // all picks or all rounds
      if (this.state.remainingOptions.length === 0 ||
          (this.state.numPicks / this.state.drafters.length === this.state.rounds)) {
        return (
          <div>
              <h2>Status of Draft "{this.state.id}"</h2>
              <table>{status}</table>
              <p>Draft is complete.</p>
          </div>
        )
      } else {
        // pick screen
        if (this.state.turnPick === "pick") {
          return (
            <div>
                <h2>Status of Draft "{this.state.id}"</h2>
                <table>{status}</table>
                <p>It's your pick!</p>
                <select value={this.state.inputPick} onChange={this.handlePick}>
                  {remainingDropDown}</select>
                <button type="button" onClick={this.handleDraft}>Draft</button>
            </div>
          )
        // wait screen
        } else {
          return (
            <div>
                <h2>Status of Draft "{this.state.id}"</h2>
                <table>{status}</table>
                <p>Waiting for
                  "{this.state.drafters[this.state.numPicks % this.state.drafters.length]}"
                  to pick</p>
                <button type="button" onClick={this.handleRefresh}>Refresh</button>
            </div>
          )
        };
      }
    };
  };

  /**
   *
   * START SCREEN
   *
   */

  handleInputID = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({inputID: parseInt(evt.target.value)});
  };

  handleJoin = (): void => {
    const url = "/api/join" +
      "?name=" + encodeURIComponent(this.state.inputID);
    fetch(url)
      .then(this.handleJoinResponse)
      .catch(this.handleServerError)
  };

  handleJoinResponse = (res: Response) => {
    if (res.status !== 200) {
      this.handleServerError(res);
    } else {
      res.json()
        .then(this.handleJoinJson)
        .catch(this.handleServerError);
    }
  };

  handleJoinJson = (data: any) => {
    // Check if input ID is valid
    const valid = data.valid;
    if (typeof valid !== "boolean" || valid === null) {
      console.error("bad data from server: 'valid' is not an array or is null", valid)
      return;
    }
    if (!valid) {
      this.setState({validID: valid});
      return;
    }

    // Check that the data in the joined draft is of the expected types
    const draft = data.contents;
    if (typeof draft.numRounds !== "number" || draft.numRounds === null) {
      console.error("bad data from server: 'numRounds' is not an array or is null",
      draft.numRounds)
      return;
    }
    if (!Array.isArray(draft.drafters) || draft.drafters === null) {
      console.error("bad data from server: 'picked' is not an array or is null",
      draft.drafters)
      return;
    }
    if (typeof draft.numPicks !== "number" || draft.numPicks === null) {
      console.error("bad data from server: 'numPicks' is not an array or is null",
      draft.numPicks)
      return;
    }
    if (!Array.isArray(draft.remaining) || draft.remaining === null) {
      console.error("bad data from server:'remaining' is not an array or is null",
        draft.remaining)
      return;
    }
    if (!Array.isArray(draft.picked) || draft.picked === null) {
      console.error("bad data from server: 'picked' is not an array or is null",
      draft.picked)
      return;
    }

    const id = data.id;
    if (typeof id !== "number" || id === null) {
      console.error("bad data from server: id is not a number or is null", id)
      return;
    }

    // Updates user to pick or wait
    let pickOrWait = "";
    if (this.state.drafter === draft.drafters[draft.numPicks]) {
      pickOrWait = "pick";
    } else {
      pickOrWait = "wait";
    }

    this.setState({
      page: "draft",
      drafters: draft.drafters,
      id: id,
      rounds: draft.numRounds,
      numPicks: draft.numPicks,
      turnPick: pickOrWait,
      remainingOptions: draft.remaining,
      pickedOptions: draft.picked});
  };

  handleDrafter = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({drafter: evt.target.value});
  };

  handleRounds = (evt: ChangeEvent<HTMLInputElement>): void => {
    const inputRounds = parseInt(evt.target.value);
    this.setState({rounds: inputRounds});
  };

  handleOptions = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    const inputOptions = evt.target.value;
    this.setState({options: inputOptions});
  };

  handleDrafters = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    const inputDrafters = evt.target.value;
    this.setState({drafters: inputDrafters});
  };

  handleCreate = (): void => {
    const optionsArray = this.state.options.split("\n");
    const draftersArray = this.state.drafters.split("\n");

    // Check if input number of rounds is valid
    if (this.state.rounds < 0 ||
        (this.state.rounds * draftersArray.length) > optionsArray.length) {
      this.setState({validRounds: false})
      return;
    }

    const url = "/api/create";
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
          "options": optionsArray,
          "drafters": draftersArray,
          "rounds": this.state.rounds}),
        headers: {'Content-Type': 'application/json'}})
      .then(this.handleCreateResponse)
      .catch(this.handleServerError)
  };

  handleCreateResponse = (res: Response) => {
    if (res.status !== 200) {
      this.handleServerError(res);
    } else {
      res.json()
        .then(this.handleCreateJson)
        .catch(this.handleServerError);
    }
  };

  handleCreateJson = (data: any) => {
    const draft = data.contents;
    // Check that the data in the created draft is of the expected types
    if (typeof draft.numRounds !== "number" || draft.numRounds === null) {
      console.error("bad data from server: 'numRounds' is not an array or is null",
      draft.numRounds)
      return;
    }
    if (!Array.isArray(draft.drafters) || draft.drafters === null) {
      console.error("bad data from server: 'drafters' is not an array or is null",
      draft.drafters)
      return;
    }
    if (typeof draft.numPicks !== "number" || draft.numPicks === null) {
      console.error("bad data from server: 'numPicks' is not an array or is null",
      draft.numPicks)
      return;
    }
    if (!Array.isArray(draft.remaining) || draft.remaining === null) {
      console.error("bad data from server:'remaining' is not an array or is null",
        draft.remaining)
      return;
    }

    const id = data.id;
    if (typeof id !== "number" || id === null) {
      console.error("bad data from server: id is not a number or is null", id)
      return;
    }

    // Updates user to pick or wait
    let pickOrWait = "";
    if (this.state.drafter === draft.drafters[0]) {
      pickOrWait = "pick";
    } else {
      pickOrWait = "wait";
    }

    this.setState({
      page: "draft",
      id: id,
      rounds: draft.numRounds,
      drafters: draft.drafters,
      numPicks: draft.numPicks,
      turnPick: pickOrWait,
      remainingOptions: draft.remaining});
  };

  handleServerError = (_: Response) => {
    console.error("unknown error talking to server");
  };

  /**
   *
   * DRAFT SCREEN
   *
   */

  handlePick = (evt: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({inputPick: evt.target.value});
  };

  handleDraft = (): void => {
    const url = "/api/pick";
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
          "id": this.state.id,
          "pick": this.state.inputPick,
          "drafter": this.state.drafter}),
        headers: {'Content-Type': 'application/json'}})
      .then(this.handleDraftReponse)
      .catch(this.handleServerError)
  };

  handleDraftReponse = (res: Response) => {
    if (res.status !== 200) {
      this.handleServerError(res);
    } else {
      res.json()
        .then(this.handleDraftJson)
        .catch(this.handleServerError);
    }
  };

  handleDraftJson = (data: any) => {
    const updated = data.contents;
    if (!Array.isArray(updated.remaining) || updated.remaining === null) {
      console.error("bad data from server:'remaining' is not an array or is null",
        updated.remaining)
      return;
    }
    if (!Array.isArray(updated.picked) || updated.picked === null) {
      console.error("bad data from server: 'picked' is not an array or is null",
        updated.picked)
      return;
    }
    if (!Array.isArray(updated.drafterOrder) || updated.drafterOrder === null) {
      console.error("bad data from server: 'drafterOrder' is not an array or is null",
        updated.drafterOrder)
      return;
    }
    if (typeof updated.numPicks !== "number" || updated.numPicks === null) {
      console.error("bad data from server: 'numPicks' is not an array or is null",
        updated.numPicks)
      return;
    }

    this.setState({
      numPicks: updated.numPicks,
      remainingOptions: updated.remaining,
      pickedOptions: updated.picked,
      drafterOrder: updated.drafterOrder,
      turnPick: "wait"});
  };

  handleRefresh = (): void => {
    const url = "/api/refresh" +
      "?name=" + encodeURIComponent(this.state.id);
    fetch(url)
      .then(this.handleRefreshResponse)
      .catch(this.handleServerError)
  };

  handleRefreshResponse = (res: Response) => {
    if (res.status !== 200) {
      this.handleServerError(res);
    } else {
      res.json()
        .then(this.handleRefreshJson)
        .catch(this.handleServerError);
    }
  };

  handleRefreshJson = (data: any) => {
    const draft = data.contents;
    if (!Array.isArray(draft.remaining) || draft.remaining === null) {
      console.error("bad data from server:'remaining' is not an array or is null",
        draft.remaining)
      return;
    }
    if (!Array.isArray(draft.picked) || draft.picked === null) {
      console.error("bad data from server: 'picked' is not an array or is null",
      draft.picked)
      return;
    }
    if (typeof draft.numPicks !== "number" || draft.numpPicks === null) {
      console.error("bad data from server: 'numpPicks' is not an array or is null",
      draft.picked)
      return;
    }

    let pickOrWait = "";
    if (this.state.drafter === this.state.drafters[draft.numPicks % this.state.drafters.length]) {
      pickOrWait = "pick";
    } else {
      pickOrWait = "wait";
    }

    this.setState({
      numPicks: draft.numPicks,
      turnPick: pickOrWait,
      remainingOptions: draft.remaining,
      pickedOptions: draft.picked,
      drafterOrder: draft.drafterOrder});
  };
}
