import React from 'react';
import { shallow } from 'enzyme';

import Form from './Form';

describe('Form', () => {
  test('Component renders', () => {
    const wrapper = shallow(<Form />);
    expect(wrapper.exists()).toBe(true);
  });
});

// describe('Form', () => {
//   test('Submit button disabled initially', () => {
//     const comp = shallow(<Form />);
//     const submitButton = comp.find('button');
//     expect(submitButton).to.be.disabled();
//   });
//
//   test('Submit button disabled after one field is entered', () => {
//     const comp = shallow(<Form />);
//     comp.setState({ name: 'Andrew' });
//     const submitButton = comp.find('button');
//     expect(submitButton).to.be.disabled();
//   });
//
//   test('Submit button enabled when all four fields are entered', () => {
//     const comp = shallow(<Form />);
//     comp.setState({ name: 'Andrew' });
//     comp.setState({ passengers: '4' });
//     comp.setState({ currentLocation: 'Adirondack Circle' });
//     comp.setState({ destination: 'Track Lot/KDR' });
//     const submitButton = comp.find('button');
//     expect(submitButton).to.be.enabled();
//   });
//
//   test('Submit button disabled when one of the four entered fields is cleared', () => {
//     let comp;
//     comp = shallow(<Form
//       name="Andrew"
//       passengers="4"
//       currentLocation="Adirondack Circle"
//       destination="Track Lot/KDR"
//     />);
//     const submitButton = comp.find('button');
//     expect(submitButton).to.be.enabled();
//     comp.setState({ name: '' });
//     expect(submitButton).to.be.disabled();
//   });
// });

// describe('Form', () => {
//   let comp;
//   beforeEach(() => {
//     comp = shallow(<Form
//       name="Andrew"
//       passengers=4
//       currentLocation="Adirondack Circle"
//       destination="Track Lot/KDR"
//     />);
//   });
//
//   describe('Creates request object with valid properties', () => {
//   });
// });
