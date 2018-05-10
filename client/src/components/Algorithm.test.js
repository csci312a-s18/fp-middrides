/* eslint-disable no-underscore-dangle */

import { enumeratePaths, getTime, calculateETA, findOptimumPath } from './Algorithm';

const requests = [
  {
    _id: '1',
    passengers: 7,
    currentLocation: 'Adirondack Circle',
    destination: 'E Lot',
    isPickedUp: false,
    ETA: -1,
  },
  {
    _id: '2',
    passengers: 2,
    currentLocation: 'CFA',
    destination: 'R Lot',
    isPickedUp: false,
    ETA: -1,
  },
  {
    _id: '3',
    passengers: 3,
    currentLocation: 'R Lot',
    destination: 'E Lot',
    isPickedUp: false,
    ETA: -1,
  },
  {
    _id: '4',
    passengers: 2,
    currentLocation: 'Adirondack Circle',
    destination: 'R Lot',
    isPickedUp: false,
    ETA: -1,
  },
];

const requests2 = [
  {
    _id: '5af3a8ef4546118140ea984d',
    extract: '',
    name: 'reid',
    passengers: 5,
    currentLocation: 'R Lot',
    destination: 'Q Lot',
    active: true,
    isPickedUp: false,
    timestamp: '2018-05-10T02:05:35.957Z',
    ETA: -1,
  },
  {
    _id: '5af3a8c34546118140ea984c',
    extract: '',
    name: 'new2',
    passengers: 5,
    currentLocation: 'T Lot',
    destination: 'Q Lot',
    active: true,
    isPickedUp: true,
    timestamp: '2018-05-10T02:05:12.868Z',
    ETA: -1,
  },
];

const requests3 = [
  {
    _id: '5af4a7e5e156fcbb33112ce1',
    extract: '',
    name: 'Reid',
    passengers: 4,
    currentLocation: 'E Lot',
    destination: 'T Lot',
    active: true,
    isPickedUp: false,
    timestamp: '2018-05-10T20:13:25.704Z',
    ETA: 3,
  },
  {
    _id: '5af4a7f0e156fcbb33112ce2',
    extract: '',
    name: 'Crystal',
    passengers: 5,
    currentLocation: 'T Lot',
    destination: 'Track Lot/KDR',
    active: true,
    isPickedUp: false,
    timestamp: '2018-05-10T20:13:36.552Z',
    ETA: -1,
  },
  {
    _id: '5af4a7fae156fcbb33112ce3',
    extract: '',
    name: 'Woojin',
    passengers: 3,
    currentLocation: 'R Lot',
    destination: 'Q Lot',
    active: true,
    isPickedUp: false,
    timestamp: '2018-05-10T20:13:46.192Z',
    ETA: -1,
  },
];

const optimalPath1 = [
  {
    currentStop: 'Adirondack Circle', id: ['1', '4'],
  },
  {
    currentStop: 'E Lot', id: [],
  },
  {
    currentStop: 'CFA', id: ['2'],
  },
  {
    currentStop: 'R Lot', id: ['3'],
  },
  {
    currentStop: 'E Lot', id: [],
  },
];

const optimalPath2 = [
  {
    currentStop: 'Adirondack Circle', id: [],
  },
  {
    currentStop: 'R Lot', id: ['5af3a8ef4546118140ea984d'],
  },
  {
    currentStop: 'T Lot', id: ['5af3a8c34546118140ea984c'],
  },
  {
    currentStop: 'Q Lot', id: ['5af3a8c34546118140ea984c', '5af3a8ef4546118140ea984d'],
  },
];

describe('recursiveAlgorithm tests', () => {
  test('Returns empty array if there are no requests', () => {
    expect(enumeratePaths('Adirondack Circle', [], 14)).toEqual([]);
  });

  test('Enumerates the right number of paths when current stop is equal to the next pickup stop', () => {
    expect(enumeratePaths('Adirondack Circle', requests.slice(0, 2), 14)).toHaveLength(3);
  });

  test('Enumerates the right number of paths when current stop is not equal to the next pickup stop', () => {
    expect(enumeratePaths('E Lot', requests.slice(0, 2), 14)).toHaveLength(6);
  });

  test('Enumerates the correct id numbers for each stop', () => {
    const path = enumeratePaths('Adirondack Circle', requests.slice(0, 2), 14)[0];
    const expectedIds = [['1'], ['1'], ['2'], ['2']];
    for (let i = 0; i < expectedIds.length; i += 1) {
      expect(path[i].id).toEqual(expectedIds[i]);
    }
  });

  test('Enumerates correct paths when the number of passengers exceeds the bus limit', () => {
    expect(enumeratePaths('Adirondack Circle', requests.slice(0, 2), 8)).toHaveLength(1);
  });

  test('Enumerates correct paths when there are multiple requests with the same currentLocation or destination', () => {
    expect(enumeratePaths('Adirondack Circle', requests.slice(1, 3), 14)).toHaveLength(4);
  });
});

describe('getTime tests', () => {
  test('getTime calculates ETA correctly between ADK and E Lot', () => {
    expect(getTime('Adirondack Circle', 'E Lot')).toEqual(3);
  });
});

describe('calculateETA tests', () => {
  test('calculates correct ETA for a path of length 2', () => {
    const path = optimalPath1.slice(1, 3);
    calculateETA(requests, path, 0);
    const request = requests.find(item => item._id === path[1].id[0]);
    expect(request.ETA).toEqual(3.6);
  });

  test('calculates correct ETAs for path of arbitrary length for all stops', () => {
    const ids = ['1', '2', '3', '4'];
    calculateETA(requests, optimalPath1, 0);
    const expectedETA = [0, 6.6, 13.2, 0];

    ids.forEach((id) => {
      const request = requests.find(item => item._id === id);
      expect(request.ETA).toEqual(expectedETA[id - 1]);
    });
  });

  test('calculates correct ETA if initial stop is the same as current stop', () => {
    const updatedRequests = calculateETA(requests, optimalPath1.slice(0, 1), 0);
    const request = updatedRequests.find(item => item._id === '1');
    expect(request.ETA).toEqual(0);
  });

  test('bug', () => {
    const updatedRequests = calculateETA(requests2, optimalPath2, 0);
    const ids = ['5af3a8ef4546118140ea984d', '5af3a8c34546118140ea984c'];
    const expectedETA = [1.8, 7.8, 10.8];

    let count = 0;
    ids.forEach((id) => {
      const request = updatedRequests.find(item => item._id === id);
      expect(request.ETA).toEqual(expectedETA[count]);
      count += 1;
    });
  });

  test('bug2', () => {
    const paths = enumeratePaths('Adirondack Circle', requests3, 14);
    const optimalPath3 = findOptimumPath(paths);
    const updatedRequests = calculateETA(requests3, optimalPath3, 0);
    const ids = ['5af4a7fae156fcbb33112ce3', '5af4a7e5e156fcbb33112ce1', '5af4a7f0e156fcbb33112ce2'];
    const expectedETA = [1.8, 6.6, 11.399999999999999, 14.4, 16.2];

    let count = 0;
    ids.forEach((id) => {
      const request = updatedRequests.find(item => item._id === id);
      expect(request.ETA).toEqual(expectedETA[count]);
      count += 1;
    });
  });
});
