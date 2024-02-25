import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { create, join, pick, refresh } from './routes';


describe('routes', function() {

  // Testing create drafts
  it('create', function() {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/create',
      body: {
        options: ["one", "two"],
        drafters: ["1", "2"],
        rounds: "1"}});
    const res = httpMocks.createResponse();

    create(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getJSONData().contents.numRounds, 1);
    assert.deepStrictEqual(res._getJSONData().contents.drafters, ["1", "2"]);
    assert.deepStrictEqual(res._getJSONData().contents.numPicks, 0);
    assert.deepStrictEqual(res._getJSONData().contents.remaining, ["one", "two"]);
    assert.deepStrictEqual(res._getJSONData().contents.picked, []);
    assert.deepStrictEqual(res._getJSONData().contents.drafterOrder, []);
    assert.deepStrictEqual(res._getJSONData().id, 0);

    const req2 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/create',
      body: {
        options: ["blue", "green", "white"],
        drafters: ["bob"],
        rounds: "2"}});
    const res2 = httpMocks.createResponse();

    create(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData().contents.numRounds, 2);
    assert.deepStrictEqual(res2._getJSONData().contents.drafters, ["bob"]);
    assert.deepStrictEqual(res2._getJSONData().contents.numPicks, 0);
    assert.deepStrictEqual(res2._getJSONData().contents.remaining, ["blue", "green", "white"]);
    assert.deepStrictEqual(res2._getJSONData().contents.picked, []);
    assert.deepStrictEqual(res2._getJSONData().contents.drafterOrder, []);
    assert.deepStrictEqual(res2._getJSONData().id, 1);

    //reset();
  });

  // Testing join drafts
  it('join', function() {
    const req = httpMocks.createRequest(
      {method: 'GET', url: '/api/join', query: {name: "0"}});
    const res = httpMocks.createResponse();

    join(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getJSONData().valid, true);
    assert.deepStrictEqual(res._getJSONData().contents.drafters, ["1", "2"]);
    assert.deepStrictEqual(res._getJSONData().contents.numPicks, 0);
    assert.deepStrictEqual(res._getJSONData().contents.remaining, ["one", "two"]);
    assert.deepStrictEqual(res._getJSONData().contents.picked, []);
    assert.deepStrictEqual(res._getJSONData().contents.drafterOrder, []);
    assert.deepStrictEqual(res._getJSONData().id, 0);

    const req2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/join', query: {name: "1"}});
    const res2 = httpMocks.createResponse();

    join(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData().valid, true);
    assert.deepStrictEqual(res2._getJSONData().contents.numRounds, 2);
    assert.deepStrictEqual(res2._getJSONData().contents.drafters, ["bob"]);
    assert.deepStrictEqual(res2._getJSONData().contents.numPicks, 0);
    assert.deepStrictEqual(res2._getJSONData().contents.remaining, ["blue", "green", "white"]);
    assert.deepStrictEqual(res2._getJSONData().contents.picked, []);
    assert.deepStrictEqual(res2._getJSONData().contents.drafterOrder, []);
    assert.deepStrictEqual(res2._getJSONData().id, 1);

    const req3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/join', query: {name: "2"}});
    const res3 = httpMocks.createResponse();

    join(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getJSONData().valid, false);

    const req4 = httpMocks.createRequest(
      {method: 'GET', url: '/api/join', query: {name: "5"}});
    const res4 = httpMocks.createResponse();

    join(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getJSONData().valid, false);
  });

  // Testing picking from drafts
  it('pick', function() {
    // pick from draft at 0
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/pick',
      body: {
        id: "0",
        pick: "two",
        drafter: "1"}});
    const res = httpMocks.createResponse();

    pick(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getJSONData().contents.numRounds, 1);
    assert.deepStrictEqual(res._getJSONData().contents.drafters, ["1", "2"]);
    assert.deepStrictEqual(res._getJSONData().contents.numPicks, 1);
    assert.deepStrictEqual(res._getJSONData().contents.remaining, ["one"]);
    assert.deepStrictEqual(res._getJSONData().contents.picked, ["two"]);
    assert.deepStrictEqual(res._getJSONData().contents.drafterOrder, ["1"]);

    const req2 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/pick',
      body: {
        id: "0",
        pick: "one",
        drafter: "2"}});
    const res2 = httpMocks.createResponse();

    pick(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData().contents.numRounds, 1);
    assert.deepStrictEqual(res2._getJSONData().contents.drafters, ["1", "2"]);
    assert.deepStrictEqual(res2._getJSONData().contents.numPicks, 2);
    assert.deepStrictEqual(res2._getJSONData().contents.remaining, []);
    assert.deepStrictEqual(res2._getJSONData().contents.picked, ["two", "one"]);
    assert.deepStrictEqual(res2._getJSONData().contents.drafterOrder, ["1", "2"]);

    // pick from draft at 1
    const req3 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/pick',
      body: {
        id: "1",
        pick: "green",
        drafter: "bob"}});
    const res3 = httpMocks.createResponse();

    pick(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getJSONData().contents.numRounds, 2);
    assert.deepStrictEqual(res3._getJSONData().contents.drafters, ["bob"]);
    assert.deepStrictEqual(res3._getJSONData().contents.numPicks, 1);
    assert.deepStrictEqual(res3._getJSONData().contents.remaining, ["blue", "white"]);
    assert.deepStrictEqual(res3._getJSONData().contents.picked, ["green"]);
    assert.deepStrictEqual(res3._getJSONData().contents.drafterOrder, ["bob"]);

    const req4 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/pick',
      body: {
        id: "1",
        pick: "white",
        drafter: "bob"}});
    const res4 = httpMocks.createResponse();

    pick(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getJSONData().contents.numRounds, 2);
    assert.deepStrictEqual(res4._getJSONData().contents.drafters, ["bob"]);
    assert.deepStrictEqual(res4._getJSONData().contents.numPicks, 2);
    assert.deepStrictEqual(res4._getJSONData().contents.remaining, ["blue"]);
    assert.deepStrictEqual(res4._getJSONData().contents.picked, ["green", "white"]);
    assert.deepStrictEqual(res4._getJSONData().contents.drafterOrder, ["bob", "bob"]);
  });

  // Testing refreshing drafts
  it('refresh', function() {
    // refresh draft at 0
    const req = httpMocks.createRequest(
      {method: 'GET', url: '/api/join', query: {name: "0"}});
    const res = httpMocks.createResponse();

    refresh(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getJSONData().contents.numRounds, 1);
    assert.deepStrictEqual(res._getJSONData().contents.drafters, ["1", "2"]);
    assert.deepStrictEqual(res._getJSONData().contents.numPicks, 2);
    assert.deepStrictEqual(res._getJSONData().contents.remaining, []);
    assert.deepStrictEqual(res._getJSONData().contents.picked, ["two", "one"]);
    assert.deepStrictEqual(res._getJSONData().contents.drafterOrder, ["1", "2"]);

    // refresh draft at 1
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/join', query: {name: "1"}});
    const res2 = httpMocks.createResponse();

    refresh(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData().contents.numRounds, 2);
    assert.deepStrictEqual(res2._getJSONData().contents.drafters, ["bob"]);
    assert.deepStrictEqual(res2._getJSONData().contents.numPicks, 2);
    assert.deepStrictEqual(res2._getJSONData().contents.remaining, ["blue"]);
    assert.deepStrictEqual(res2._getJSONData().contents.picked, ["green", "white"]);
    assert.deepStrictEqual(res2._getJSONData().contents.drafterOrder, ["bob", "bob"]);
  });

});
