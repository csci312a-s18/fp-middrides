/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
/* eslint no-underscore-dangle: [2, { "allow": ["_id"] }] */

const campusMap = new Map();
campusMap.set('Adirondack Circle', [['CFA', 1.8], ['E Lot', 1.2], ['R Lot', 6.0]]);
campusMap.set('CFA', [['Adirondack Circle', 2.4], ['E Lot', 3.0], ['R Lot', 3.6]]);
campusMap.set('E Lot', [['Adirondack Circle', 4.2], ['CFA', 4.8], ['R Lot', 5.4]]);
campusMap.set('R Lot', [['Adirondack Circle', 6.0], ['E Lot', 6.6], ['CFA', 7.2]]);

function getTime(source, destination) {
  const list = campusMap.get(source);
  for (let i = 0; i < list.length; i++) {
    if (list[i][0] === destination) {
      return list[i][1];
    }
  }
  return 0;
}

function totalRunningTime(paths) {
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

function calculateETA(requests, optimalPath) {
  let source = optimalPath[0].currentStop;
  let addedTime = 0;
  for (let i = 0; i < optimalPath[0].id.length; i++) {
    const req = requests.find(item => item._id === optimalPath[0].id[i]);
    if (req.currentLocation === source) {
      const ETA = (addedTime); // add systemTime and timeStamp
      req.ETA = ETA;
    }
  }
  for (let i = 1; i < optimalPath.length; i++) {
    const destination = optimalPath[i].currentStop;
    addedTime += getTime(source, destination);
    for (let j = 0; j < optimalPath[i].id.length; j++) {
      const req = requests.find(item => item._id === optimalPath[i].id[j]);
      if (req.currentLocation === destination) {
        const ETA = (addedTime); // add systemTime and timeStamp
        req.ETA = ETA;
      }
    }
    source = destination;
  }
  return requests;
}


export { calculateETA, totalRunningTime };
// export default calculateETA;
// export default totalRunningTime;
