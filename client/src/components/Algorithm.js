/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */
/* eslint-disable no-loop-func */

import campusMap from '../campus-map.json';

function getTime(source, destination) {
  return campusMap[source][destination];
}

function calculateWalkOns(requests, path, seatsLeft) {
  // console.log('path: ', path);
  let walkOns = seatsLeft;
  if (path[1]) {
    path[1].id.forEach((id) => {
      const request = requests.find(findRequest => findRequest._id === id);
      // console.log('currentLocation: ', request.currentLocation, 'current stop: ',
      // path[1].currentStop, 'destination: ', request.destination;
      if (request.currentLocation === path[1].currentStop) {
        walkOns -= request.passengers;
      } else if (request.destination === path[1].currentStop) {
        walkOns += request.passengers;
      }
    });
  } else {
    walkOns = 14;
  }
  return walkOns;
}

function enumeratePaths(currStop, reqs, remainingSeats) {
  const paths = [];

  // base case when there are no active requests
  if (reqs.length === 0) {
    return paths;
  }

  function recursiveAlgorithm(currentStop, requests, path, seatsLeft) {
    let updatedRequests = [];
    const id = [];
    requests.forEach((request) => {
      updatedRequests.push(Object.assign({}, request));
    });

    // when multiple requests are made from the same stop so that the bus is full,
    // this algorithm gives priority to the requests that were made earlier

    // either set request to "picked up" or remove from list
    const requestsToDelete = [];
    updatedRequests.forEach((request) => {
      if (!request.isPickedUp && request.currentLocation === currentStop && (
        request.passengers <= seatsLeft)) {
        seatsLeft -= request.passengers; // eslint-disable-line no-param-reassign
        request.isPickedUp = true;
        id.push(request._id);
      } else if (request.isPickedUp && request.destination === currentStop) {
        seatsLeft += request.passengers; // eslint-disable-line no-param-reassign
        id.push(request._id);
        requestsToDelete.push(request._id);
      }
    });

    requestsToDelete.forEach((deleteId) => {
      updatedRequests = updatedRequests.filter(request => request._id !== deleteId);
    });

    path.push({ currentStop, id });

    // create list of available stops
    const available = [];
    for (let i = 0; i < updatedRequests.length; i++) {
      if (!updatedRequests[i].isPickedUp) {
        if (seatsLeft - updatedRequests[i].passengers >= 0
          && !available.includes(updatedRequests[i].currentLocation)) {
          available.push(updatedRequests[i].currentLocation);
        }
      } else if (!available.includes(updatedRequests[i].destination)) {
        available.push(updatedRequests[i].destination);
      }
    }

    // base case
    if (available.length === 0) {
      paths.push(path);
    } else {
      for (let i = 0; i < available.length; i++) {
        // double check if we need to copy seatsLeft before passing to the next funciton
        recursiveAlgorithm(available[i], updatedRequests, path.slice(), seatsLeft);
      }
    }
  }

  recursiveAlgorithm(currStop, reqs, [], remainingSeats);
  return paths;
}

function calculateMaxWaitTime(requests, path, now) {
  let runningTime = 0;
  let maxWaitTime = -1;
  for (let i = 1; i < path.length; i += 1) {
    const ids = path[i].id;
    runningTime += getTime(path[i - 1].currentStop, path[i].currentStop);
    ids.forEach((id) => { // eslint-disable-line no-loop-func
      const req = requests.find(request => id === request._id);
      if (req.destination === path[i].currentStop) {
        const timeStamp = Date.parse(req.timestamp) / 60000;
        const waitTime = now - timeStamp + runningTime; // eslint-disable-line no-mixed-operators
        if (waitTime > maxWaitTime) {
          maxWaitTime = waitTime;
        }
      }
    });
  }
  return maxWaitTime;
}

function findOptimumPath(requests, paths, now) {
  if (paths[0]) {
    let optimalPath = paths[0];
    let optimalMetric = calculateMaxWaitTime(requests, optimalPath, now);

    for (let path = 1; path < paths.length; path++) {
      const metric = calculateMaxWaitTime(requests, paths[path], now);

      if (metric < optimalMetric) {
        optimalMetric = metric;
        optimalPath = paths[path];
      }
    }
    return optimalPath;
  }
  return [];
}

function calculateETA(requests, optimalPath, runningTime) {
  if (optimalPath.length === 1) {
    const ids = optimalPath[0].id;
    ids.forEach((id) => {
      const req = requests.find(item => item._id === id);
      if (req.currentLocation === optimalPath[0].currentStop) {
        req.ETA = runningTime;
      }
    });
    return requests;
  }

  const ids = optimalPath[0].id;
  ids.forEach((id) => {
    const req = requests.find(item => item._id === id);
    if (req.currentLocation === optimalPath[0].currentStop) {
      req.ETA = runningTime;
    }
  });

  const eta = getTime(optimalPath[0].currentStop, optimalPath[1].currentStop);
  const newRunningTime = runningTime + eta;
  return calculateETA(requests, optimalPath.slice(1), newRunningTime);
}


export {
  enumeratePaths, calculateETA, findOptimumPath, getTime,
  calculateMaxWaitTime, calculateWalkOns,
};
