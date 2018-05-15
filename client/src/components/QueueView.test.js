import React from 'react';
import { shallow } from 'enzyme';

import QueueView from './QueueView';

const requestActive = {
  name: 'Beyonce Knowles-Carter',
  passengers: 3, // needs to be converted to integer to be handled
  currentLocation: 'E Lot',
  destination: 'T Lot',
  active: true, // needs to be converted to boolean to be handled
  isPickedUp: false,
  ETA: 0,
  _id: '1',
};
const requestPickedUp = {
  name: 'Kelendria Trene Rowland ',
  passengers: 3, // needs to be converted to integer to be handled
  currentLocation: 'E Lot',
  destination: 'T Lot',
  active: true, // needs to be converted to boolean to be handled
  isPickedUp: true,
  ETA: 10,
  _id: '2',
};

const requestArray = [requestActive, requestPickedUp];


describe('QueueView renders', () => {
  test('Component renders properly', () => {
    const wrapper = shallow(<QueueView requests={requestArray} mode="DispatcherMode" complete={jest.fn} />);
    expect(wrapper.exists()).toBe(true);
  });

  test('Table renders', () => {
    const wrapper = shallow(<QueueView requests={requestArray} mode="DispatcherMode" complete={jest.fn} />);
    const tdBody = wrapper.find('#tdBody');
    const tdName = wrapper.find('#tdName');
    const tdpassengers = wrapper.find('#tdpassengers');
    const tdcurrentLocation = wrapper.find('#tdcurrentLocation');
    const tddestination = wrapper.find('#tddestination');
    const tdactive = wrapper.find('#tdactive');
    const tdETA = wrapper.find('#tdETA');
    expect(wrapper.exists()).toBe(true);
    expect(tdBody.exists()).toBe(true);
    expect(tdBody.childAt(0).children().length).toEqual(8);
    expect(tdName.exists()).toBe(true);
    expect(tdpassengers.exists()).toBe(true);
    expect(tdcurrentLocation.exists()).toBe(true);
    expect(tddestination.exists()).toBe(true);
    expect(tdactive.exists()).toBe(true);
    expect(tdETA.exists()).toBe(true);
  });
  test('Table maps correctly', () => {
    const wrapper = shallow(<QueueView requests={requestArray} mode="DispatcherMode" complete={jest.fn} />);
    const tdBody = wrapper.find('#tdBody');
    const tdBodyStr = tdBody.map(item => item.text());
    expect(tdBodyStr).toEqual(['Beyonce Knowles-Carter3E LotT Lot0 <ButtonToolbar />Kelendria Trene Rowland 3E LotT Lot10 <ButtonToolbar />']);
  });
});

describe('Ride Buttons function', () => {
  test('Active rides have <btnPickUp> and not <btnDropOff>', () => {
    const activeRequest = requestArray.filter(request => request.isPickedUp === false);
    const wrapper = shallow(<QueueView requests={activeRequest} mode="DispatcherMode" complete={jest.fn} />);
    const btnPickup = wrapper.find('#btnPickup');
    const btnDropOff = wrapper.find('#btnDropOff');
    expect(btnPickup.exists()).toBe(true);
    expect(btnDropOff.exists()).toBe(false);
  });

  test('Active rides have <btnCancelActiveRide> and not <btnCanclePickUpRide>', () => {
    const activeRequest = requestArray.filter(request => request.isPickedUp === false);
    const wrapper = shallow(<QueueView requests={activeRequest} mode="DispatcherMode" complete={jest.fn} />);
    const btnCancleActiveRide = wrapper.find('#btnCancleActiveRide');
    const btnCancelPickUpRide = wrapper.find('#btnCancelPickUpRide');
    expect(btnCancleActiveRide.exists()).toBe(true);
    expect(btnCancelPickUpRide.exists()).toBe(false);
  });

  test('Picked up rides have <btnDropOff>', () => {
    const activeRequest = requestArray.filter(request => request.isPickedUp === true);
    const wrapper = shallow(<QueueView requests={activeRequest} mode="DispatcherMode" complete={jest.fn} />);
    const btnPickup = wrapper.find('#btnPickup');
    const btnDropOff = wrapper.find('#btnDropOff');
    expect(btnPickup.exists()).toBe(false);
    expect(btnDropOff.exists()).toBe(true);
  });

  test('Picked up rides have <btnCanclePickUpRide>', () => {
    const activeRequest = requestArray.filter(request => request.isPickedUp === true);
    const wrapper = shallow(<QueueView requests={activeRequest} mode="DispatcherMode" complete={jest.fn} />);
    const btnCancleActiveRide = wrapper.find('#btnCancleActiveRide');
    const btnCancelPickUpRide = wrapper.find('#btnCancelPickUpRide');
    expect(btnCancleActiveRide.exists()).toBe(false);
    expect(btnCancelPickUpRide.exists()).toBe(true);
  });
});
