import React from 'react';
import RecursiveAlgorithm from './GPS';

let requests = [
  {
    _id: 1,
    passengers: 7,
    currentLocation: 'A',
    destination: 'B',
    isPickedUp: false
  },
  {
    _id: 2,
    passengers: 2,
    currentLocation: 'A',
    destination: 'D',
    isPickedUp: false
  },
  {
    _id: 3,
    passengers: 3,
    currentLocation: 'A',
    destination: 'F',
    isPickedUp: false
  },
  {
    _id: 4,
    passengers: 2,
    currentLocation: 'A',
    destination: 'D',
    isPickedUp: false
  }
];

describe('Enumerates possible paths', () => {
  test('Returns empty array if there are no requests', () => {
    expect(RecursiveAlgorithm('', [], [], 14)).toEqual([]);
  });

  test('Enumerates the right number of paths', () => {
    expect(RecursiveAlgorithm('A', requests, ))
    expect(requests.find('MovieTable').prop('movies')).toHaveLength(2);
  });

  test('Enumerates the correct id numbers for each stop', () => {
    expect(requests.find('MovieTable').prop('movies')).toHaveLength(2);
  });

  test('Enumerates correct paths when the number of passengers exceeds the bus limit', () => {
    expect();
  });

  test('Enumerates correct paths when there are multiple requests with the same currentLocation or destination', () => {
    expect();
  });
});
