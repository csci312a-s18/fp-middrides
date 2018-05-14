
import React from 'react';
import { shallow } from 'enzyme';

import MapContainer from './Map';// eslint-disable-line import/no-named-as-default

describe('MapContainer', () => {
  test('Component renders', () => {
    const wrapper = shallow(<MapContainer complete={jest.fn} />);
    expect(wrapper.exists()).toBe(true);
  });
});
