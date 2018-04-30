const paths = [];

const request1 = {
  _id: 1,
  passengers: 7,
  currentLocation: 'A',
  destination: 'B',
  isPickedUp: false,
};

const request2 = {
  _id: 2,
  passengers: 2,
  currentLocation: 'A',
  destination: 'D',
  isPickedUp: false,
};

const request3 = {
  _id: 3,
  passengers: 3,
  currentLocation: 'A',
  destination: 'F',
  isPickedUp: false,
};

const request4 = {
  _id: 4,
  passengers: 2,
  currentLocation: 'A',
  destination: 'D',
  isPickedUp: false,
};

const requests = [request1, request2, request3];

function recursiveAlgorithm(currentStop, requests, path, seatsLeft) {
  const updatedRequests = [];
  const id = [];
  requests.forEach(request => updatedRequests.push(Object.assign({}, request)));

  // when multiple requests are made from the same stop so that the bus is full, this algorithm gives priority to the requests that were made earlier

  // either set request to "picked up" or remove from list
  updatedRequests.forEach((request) => {
    if (!request.isPickedUp && request.currentLocation === currentStop && request.passengers <= seatsLeft) {
      seatsLeft -= request.passengers;
      request.isPickedUp = true;
      id.push(request._id);
    } else if (request.isPickedUp && request.destination === currentStop) {
      seatsLeft += request.passengers;
      id.push(request._id);
      updatedRequests.splice(updatedRequests.indexOf(request), 1); // request has been "dropped off"
    }
  });


  path.push({ currentStop, id });
  console.log('---------------------------------');
  // console.log(seatsLeft);

  // create list of available stops
  const available = [];
  for (let i = 0; i < updatedRequests.length; i++) {
    if (!updatedRequests[i].isPickedUp) {
      if (seatsLeft - updatedRequests[i].passengers >= 0) {
        available.push(updatedRequests[i].currentLocation);
      }
    } else {
      available.push(updatedRequests[i].destination);
    }
  }
  // console.info(updatedRequests);
  console.log(`Path: ${path}`);
  console.log(`currentStop: ${currentStop}`);
  console.log(`id: ${id}`);
  console.log(`available: ${available}`);


  // base case
  if (available.length === 0) {
    // console.log('Path: ' + path);
    paths.push(path);
  }

  // recursive step
  else {
    for (let i = 0; i < available.length; i++) {
      // double check if we need to copy seatsLeft before passing to the next funciton
      recursiveAlgorithm(available[i], updatedRequests, path.slice(), seatsLeft);
    }
  }
}

recursiveAlgorithm('A', requests, [], 14);
console.log(paths);
for (let i = 0; i < paths.length; i++) {
  for (let j = 0; j < paths[i].length; j++) {
    console.log(`ids: ${paths[i][j].id}`);
  }
}
// paths.forEach(request => console.log(request.id));
// console.log(paths.length);
