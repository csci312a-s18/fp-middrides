import React from 'react';
import { shallow } from 'enzyme';

import RequestForm from './RequestForm';


describe('RequestForm', () => {
  test('Component renders', () => {
    const wrapper = shallow(<RequestForm complete={jest.fn} />);
    expect(wrapper.exists()).toBe(true);
  });

  test('Submit button disabled after one field is entered', () => {
    let comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'Andrew' });
    const submitButton = comp.find('btnSubmitRide');
    expect(submitButton.disabled).toBe(true);
  });
});

//
//   test('Submit button enabled when all four fields are entered', () => {
//     let comp = shallow(<RequestForm complete={jest.fn} />);
//     comp.setState({ name: 'Andrew' });
//     comp.setState({ passengers: '4' });
//     comp.setState({ currentLocation: 'Adirondack Circle' });
//     comp.setState({ destination: 'Track Lot/KDR' });
//     // const submitButton = comp.find('button').at(0);
//     expect(comp.getElement().disabled).toBe(false);
//   });
//
//   test('Submit button disabled when current location and destination are the same', () => {
//       let comp = shallow(<RequestForm complete={jest.fn} />);
//       comp.setState({ name: 'Andrew' });
//       comp.setState({ passengers: '4' });
//       comp.setState({ currentLocation: 'Adirondack Circle' });
//       comp.setState({ destination: 'Adirondack Circle' });
//       // const submitButton = comp.find('button').at(0);
//       expect(comp.getElement().disabled).toBe(true);
//     });
//
//   test('Submit button disabled when one of the four entered fields is cleared', () => {
//     let comp;
//     comp = shallow(<RequestForm
//       name="Andrew"
//       passengers="4"
//       currentLocation="Adirondack Circle"
//       destination="Track Lot/KDR"
//       complete={jest.fn}
//     />);
//     // const submitButton = comp.find('button').at(0);
//     expect(comp.getElement().disabled).toBe(false);
//     comp.setState({ name: '' });
//     expect(comp.getElement().disabled).toBe(true);
//   });
// });
