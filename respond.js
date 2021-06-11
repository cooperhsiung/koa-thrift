/**
 * Created by Cooper on 2021/06/11.
 * copy from https://github.com/apache/thrift/blob/master/lib/nodejs/lib/thrift/server.js
 */
var TBufferedTransport = require('thrift/lib/nodejs/lib/thrift/buffered_transport');
var TBinaryProtocol = require('thrift/lib/nodejs/lib/thrift/binary_protocol');
var InputBufferUnderrunError = require('thrift/lib/nodejs/lib/thrift/input_buffer_underrun_error');

module.exports = function respond(stream, processor, options) {
  var transport =
    options && options.transport ? options.transport : TBufferedTransport;
  var protocol =
    options && options.protocol ? options.protocol : TBinaryProtocol;

  var self = this;

  stream.on('error', function (err) {
    self.emit('error', err);
  });
  stream.on(
    'data',
    transport.receiver(function (transportWithData) {
      var input = new protocol(transportWithData);
      var output = new protocol(
        new transport(undefined, function (buf) {
          try {
            stream.write(buf);
          } catch (err) {
            self.emit('error', err);
            stream.end();
          }
        })
      );

      try {
        do {
          processor.process(input, output);
          transportWithData.commitPosition();
        } while (true);
      } catch (err) {
        if (err instanceof InputBufferUnderrunError) {
          //The last data in the buffer was not a complete message, wait for the rest
          transportWithData.rollbackPosition();
        } else if (err.message === 'Invalid type: undefined') {
          //No more data in the buffer
          //This trap is a bit hackish
          //The next step to improve the node behavior here is to have
          //  the compiler generated process method throw a more explicit
          //  error when the network buffer is empty (regardles of the
          //  protocol/transport stack in use) and replace this heuristic.
          //  Also transports should probably not force upper layers to
          //  manage their buffer positions (i.e. rollbackPosition() and
          //  commitPosition() should be eliminated in lieu of a transport
          //  encapsulated buffer management strategy.)
          transportWithData.rollbackPosition();
        } else {
          //Unexpected error
          self.emit('error', err);
          stream.end();
        }
      }
    })
  );

  stream.on('end', function () {
    stream.end();
  });
};
