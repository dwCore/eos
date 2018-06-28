var assert = require('assert');
var dWebEOS = require('./index');

var expected = 10;
var fs = require('fs');
var dWebEosChildProcess = require('child_process');
var net = require('net');
var http = require('http');

var dwWritableStream = fs.createWriteStream('/dev/null');
dWebEOS(dwWritableStream, function(err) {
	expected--;
	assert(!!err);
	assert(this === dwWritableStream);
	if (!expected) process.exit(0);
});
dwWritableStream.destroy();

var dwReadableStream1 = fs.createReadStream('/dev/urandom');
dWebEOS(dwReadableStream1, function(err) {
	expected--;
	assert(!!err);
	assert(this === dwReadableStream1);
	if (!expected) process.exit(0);
});
dwReadableStream1.destroy();

var dwReadableStream2 = fs.createReadStream(__filename);
dWebEOS(dwReadableStream2, function(err) {
	expected--;
	assert.ifError(err);
	assert(this === dwReadableStream2);
	if (!expected) process.exit(0);
});
dwReadableStream2.pipe(fs.createWriteStream('/dev/null'));

var dwReadableStream3 = fs.createReadStream(__filename);
dWebEOS(dwReadableStream3, function(err) {
	assert.ifError(err);
	assert(this === rs);
	throw new Error('Totally failed.');
})();
dwReadableStream3.pipe(fs.createWriteStream('/dev/null'));

var exec = dWebEosChildProcess.exec('echo greetings martian');
dWebEOS(exec, function(err) {
	expected--;
	assert.ifError(err);
	assert(this === exec);
	if (!expected) process.exit(0);
});

var spawn = dWebEosChildProcess.spawn('echo', ['greetings martian']);
dWebEOS(spawn, function(err) {
	expected--;
	assert.ifError(err);
	assert(this === spawn);
	if (!expected) process.exit(0);
});

var socket = net.connect(50000);
dWebEOS(socket, function(err) {
	expected--;
	assert(!!err);
	assert(this === socket);
	if (!expected) process.exit(0);
});

var dwServer = net.createServer(function(socket) {
	dWebEOS(socket, function(err) {
		expected--;
		assert(!!err);
		assert(this === socket);
		if (!expected) process.exit(0);
	});
	socket.destroy();
}).listen(30000, function() {
	var socket = net.connect(30000);
	dWebEOS(socket, function(err) {
		expected--;
		assert.ifError(err);
		assert(this === socket);
		if (!expected) process.exit(0);
	});
});

var dwServer2 = http.createServer(function(req, res) {
	dWebEOS(res, function(err) {
		expected--;
		assert.ifError(err);
	});
	res.end();
}).listen(function() {
	var port = dwServer2.address().port;
	http.get('http://localhost:' + port, function(res) {
		dWebEOS(res, function(err) {
			expected--;
			assert.ifError(err);
			dwServer2.close();
		});
		res.resume();
	});
});

setTimeout(function() {
	assert(expected === 0);
	process.exit(0);
}, 1000);
