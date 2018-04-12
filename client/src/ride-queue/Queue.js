import React from 'react';

var QUEUE = [];

function queueRequest(request) {
  QUEUE.push(request);
}

function popRequest() {
  const request = QUEUE.shift();
  return request;
}

function getQueue() {
  return QUEUE;
}

export default Queue;
