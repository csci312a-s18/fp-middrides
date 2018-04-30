let paths = [];

let request1 = {
  passengers: 10,
  currentLocation: 'A',
  destination: 'B',
  isPickedUp: true
};

let request2 = {
  passengers: 6,
  currentLocation: 'C',
  destination: 'D',
  isPickedUp: false
};

let request3 = {
  passengers: 5,
  currentLocation: 'E',
  destination: 'F',
  isPickedUp: false
};

let request4 = {
  passengers: 5,
  currentLocation: 'A',
  destination: 'D',
  isPickedUp: false
};

let requests = [request1, request2, request3, request4];

function recursiveAlgorithm(currentStop, requests, path, seatsLeft) {

  let updatedRequests = [];
  requests.forEach(request => updatedRequests.push(Object.assign({}, request)));

  // either set request to "picked up" or remove from list
  updatedRequests.forEach(request => {
    if (!request.isPickedUp && request.currentLocation === currentStop) {
      seatsLeft -= request.passengers;
      request.isPickedUp = true;
    }
    else if (request.isPickedUp && request.destination === currentStop) {
      seatsLeft += request.passengers;
      updatedRequests.splice(updatedRequests.indexOf(request), 1); // request has been "dropped off"
    }
  });

  path.push(currentStop);
  console.log('---------------------------------');
  console.log(seatsLeft);

  // create list of available stops
  let available = [];
  for (let i = 0; i < updatedRequests.length; i++) {
    if (!updatedRequests[i].isPickedUp) {
      if (seatsLeft - updatedRequests[i].passengers >= 0){
        available.push(updatedRequests[i].currentLocation);
      }
    }
    else {
      available.push(updatedRequests[i].destination);
    }

  }
  //console.info(updatedRequests);
  console.log('Path: ' + path);
  console.log(available);


  // base case
  if (available.length === 0) {
    //console.log('Path: ' + path);
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

recursiveAlgorithm('A', requests, [], 4);
console.log(paths);
//console.log(paths.length);
