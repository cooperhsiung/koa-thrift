/**
 * Created by Cooper on 2021/06/12.
 */

// generate types
// thrift -r --gen js:node unpkg.thrift

var UnpkgService = require('./gen-nodejs/UnpkgService');
var ttypes = require('./gen-nodejs/unpkg_types');
const assert = require('assert');
const thrift = require('thrift');

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection('localhost', 9090, {
  transport: transport,
  protocol: protocol,
});

connection.on('error', function (err: any) {
  assert(false, err);
});

var client = thrift.createClient(UnpkgService, connection);

const req = new ttypes.PublishRequest();
req.name = 'koa-thrift';
req.version = 12;

client.Publish(req, function (err: any, resp: any) {
  if (err) {
    console.log('Unexpected ' + err);
  } else {
    console.log(resp);
  }
});
