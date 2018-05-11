import React from 'react';
import { shallow } from 'enzyme';

import MapContainer from './Map';// eslint-disable-line import/no-named-as-default

describe('MapContainer', () => {
  // const fakeLat = 46.0153;
  // const fakeLng = -77.1673;
  test('Component renders', () => {
    const wrapper = shallow(<MapContainer complete={jest.fn} />);
    expect(wrapper.exists()).toBe(true);
//    expect(wrapper.find('Marker').extists()).toBe(true);
  });
});
