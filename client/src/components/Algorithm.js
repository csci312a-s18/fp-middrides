/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

import campusMap from '../campus-map.json';

function getTime(source, destination) {
  return campusMap[source][destination];
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
        request.passengers <= seatsLeft)) { // Do we need to check this?
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

function findOptimumPath(paths) {
  let totalTime = Number.POSITIVE_INFINITY;
  let optimalPath = paths[0];
  for (let path = 0; path < paths.length; path++) {
    let runningTime = 0;
    for (let node = 1; node < paths[path].length; node++) {
      const currentNode = paths[path][node];
      runningTime += getTime(paths[path][node - 1].currentStop, currentNode.currentStop);
    }
    if (runningTime < totalTime) {
      totalTime = runningTime;
      optimalPath = paths[path];
    }
  }
  return optimalPath;
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


export { enumeratePaths, calculateETA, findOptimumPath, getTime };
