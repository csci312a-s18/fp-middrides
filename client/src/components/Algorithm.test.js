import { enumeratePaths } from './Algorithm';

const requests = [
  {
    _id: 1,
    passengers: 7,
    currentLocation: 'Adirondack Circle',
    destination: 'E Lot',
    isPickedUp: false,
  },
  {
    _id: 2,
    passengers: 2,
    currentLocation: 'CFA',
    destination: 'R Lot',
    isPickedUp: false,
  },
  {
    _id: 3,
    passengers: 3,
    currentLocation: 'R Lot',
    destination: 'E Lot',
    isPickedUp: false,
  },
  {
    _id: 4,
    passengers: 2,
    currentLocation: 'Adirondack Circle',
    destination: 'R Lot',
    isPickedUp: false,
  },
];

describe('Enumerates possible paths', () => {
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
    const expectedIds = [[1], [1], [2], [2]];
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
