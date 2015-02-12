/**
 * Created by lynch446 on 2/12/15.
 */
'use strict';

var student = require('./student.model');

exports.register = function(socket) {
  student.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  student.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('student:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('student:remove', doc);
}
