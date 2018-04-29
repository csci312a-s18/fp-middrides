let paths = [];

let request1 = {
  currentLocation: 'A',
  destination: 'B',
  isPickedUp: true
};

let request2 = {
  currentLocation: 'C',
  destination: 'D',
  isPickedUp: false
};

let requests = [request1, request2];

function recursiveAlgorithm(currentStop, requests, path) {

  // either set request to "picked up" or remove from list
  requests.forEach(request => {
    if (!request.isPickedUp && request.currentLocation === currentStop) {
      request.isPickedUp = true;
    }
    else if (request.isPickedUp && request.destination === currentStop) {
      requests.splice(requests.indexOf(request), 1); // request has been "dropped off"
    }
  });

  path.push(currentStop);

  // create list of available stops
  let available = [];
  for (let i = 0; i < requests.length; i++) {
    if (!requests[i].isPickedUp) {
      available.push(requests[i].currentLocation);
    }
    else {
      available.push(requests[i].destination);
    }
  }

  console.log(available);

  // base case
  if (available.length === 0) {
    console.log('Path: ' + path);
    paths.push(path);
  }

  // recursive step
  else {
    for (let i = 0; i < available.length; i++) {
      recursiveAlgorithm(available[i], requests.slice(), path.slice());
    }
  }
}

recursiveAlgorithm('A', requests, []);
console.log(paths);
