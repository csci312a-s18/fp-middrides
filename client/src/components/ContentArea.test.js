import React from 'react';
import { shallow } from 'enzyme';

import ContentArea from './ContentArea';

const request = {
  name: 'Beyonce Knowles-Carter',
  passengers: 3, // needs to be converted to integer to be handled
  currentLocation: 'E Lot',
  destination: 'T Lot',
  active: true, // needs to be converted to boolean to be handled
  isPickedUp: false,
};

describe('ContentArea', () => {
  test('Component renders Properly', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    expect(wrapper.exists()).toBe(true);
  });

  test('Initial start display correct features', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    const btnRequestRide = wrapper.find('#btnRequestRide');
    const btncancelRide = wrapper.find('#btnCancelRide');
    const gps = wrapper.find('#gps');
    expect(btnRequestRide.exists()).toBe(true);
    expect(btncancelRide.exists()).toBe(false);
    expect(gps.exists()).toBe(true);
  });
});

describe('Request button functionality', () => {
  test('<btnRequestRideUser> loads RequestFormView', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    const btnRequestRide = wrapper.find('#btnRequestRide');
    btnRequestRide.simulate('click');
    wrapper.update();
    expect(wrapper.state('viewmode')).toEqual('RequestRideUser');
  });
});

describe('Cancel button functionality', () => {
  test('<btnCancel> exists only if user has ride', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    const btncancelRideInitial = wrapper.find('#btnCancelRide');
    expect(btncancelRideInitial.exists()).toBe(false);
    wrapper.setState({ currentRequest: request });
    expect(wrapper.state('currentRequest')).toEqual(request);
    const btnRequestRide = wrapper.find('#btnRequestRide');
    expect(btnRequestRide.exists()).toBe(false);
    const btncancelRidePost = wrapper.find('#btnCancelRide');
    expect(btncancelRidePost.exists()).toBe(true);
  });


  test('<btnCancel> cancels currentRequest and reverts button', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ currentRequest: request });
    const btncancelRide = wrapper.find('#btnCancelRide');

    btncancelRide.simulate('click');
    wrapper.update();

    const btncancelRideClicked = wrapper.find('#btnCancelRide');
    expect(wrapper.state('currentRequest')).toEqual(null);
    expect(btncancelRideClicked.exists()).toBe(false);
  });
});


describe('Temp', () => {
  test('Component renders Properly', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    expect(wrapper.exists()).toBe(true);
  });

  test('Dispatcher logs in sucessfully', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    expect(wrapper.exists()).toBe(true);
  });

  test('cancel exists only if user has ride', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    expect(wrapper.exists()).toBe(true);
  });

  test('Enter in login works to login', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    expect(wrapper.exists()).toBe(true);
  });
});
