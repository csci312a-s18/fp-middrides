import React from 'react';
import { shallow } from 'enzyme';

import RequestForm from './RequestForm';


describe('RequestForm renders correctly', () => {
  test('Component renders', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    expect(comp.exists()).toBe(true);
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });
});

describe('Submit Button is disabled until all fields entered properly', () => {
  test('<btnSubmitRide> disabled after name field is entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'Andrew' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled after passengers field is entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ passengers: '10' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled after destination field is entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ destination: 'E Lot' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled after currentLocation field is entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ currentLocation: 'Adirondack Circle' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled  and passengers are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'Andrew' });
    comp.setState({ passengers: '4' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled when name and currentLocation are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'Andrew' });
    comp.setState({ currentLocation: 'Adirondack Circle' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled when all name and destination are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'Andrew' });
    comp.setState({ destination: 'Adirondack Circle' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled when passengers and currentLocation are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ passengers: '3' });
    comp.setState({ currentLocation: 'Adirondack Circle' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled when passengers and destination are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ passengers: '5' });
    comp.setState({ destination: 'Adirondack Circle' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled when currentLocation and destination are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ currentLocation: 'E Lot' });
    comp.setState({ destination: 'Adirondack Circle' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled when name, passengers and currentLocation are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'Andrew' });
    comp.setState({ passengers: '6' });
    comp.setState({ currentLocation: 'Adirondack Circle' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled when name, passengers and destination are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'Andrew' });
    comp.setState({ passengers: '6' });
    comp.setState({ destination: 'Adirondack Circle' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled when name, currentLocation and destination are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'Andrew' });
    comp.setState({ currentLocation: 'Adirondack Circle' });
    comp.setState({ destination: 'E Lot' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> disabled when passengers, currentLocation and destination are entered', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ passengers: '3' });
    comp.setState({ currentLocation: 'Adirondack Circle' });
    comp.setState({ destination: 'E Lot' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });

  test('<btnSubmitRide> enabled when all fields set and currentLocation does not equal destination', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'ya mam' });
    comp.setState({ passengers: '7' });
    comp.setState({ currentLocation: 'E Lot' });
    comp.setState({ destination: 'T Lot' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(false);
  });

  test('<btnSubmitRide> disabled when all fields set and currentLocation does equal destination', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'ya mam' });
    comp.setState({ passengers: '7' });
    comp.setState({ currentLocation: 'E Lot' });
    comp.setState({ destination: 'E Lot' });
    const submitButton = comp.find('#btnSubmitRide');
    expect(submitButton.prop('disabled')).toBe(true);
  });
});

describe('Cancling ride clears fields', () => {
  test('<btnSubmitRide> enabled when all fields set and currentLocation does not equal destination', () => {
    const comp = shallow(<RequestForm complete={jest.fn} />);
    comp.setState({ name: 'ya mam' });
    comp.setState({ passengers: '7' });
    comp.setState({ currentLocation: 'E Lot' });
    comp.setState({ destination: 'T Lot' });
    const btnCancel = comp.find('#btnCancel');
    btnCancel.simulate('click');
    expect(comp.state()).toEqual({
      name: '',
      passengers: '',
      currentLocation: '',
      destination: '',
    });
  });
});
