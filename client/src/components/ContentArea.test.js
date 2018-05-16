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
  id: '1',
};


describe('ContentArea', () => {
  test('Component renders properly', () => {
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

  test('<btnRequestRideUser> isn\'t present if there\'s a currentRequest', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ currentRequest: request });
    expect(wrapper.state('currentRequest')).toEqual(request);
    const btnRequestRidePost = wrapper.find('#btnRequestRide');
    expect(btnRequestRidePost.exists()).toBe(false);
  });
});

describe('Cancel button functionality', () => {
  test('<btnCancelRide> exists only if user has ride', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    const btncancelRideInitial = wrapper.find('#btnCancelRide');
    expect(btncancelRideInitial.exists()).toBe(false);
    wrapper.setState({ currentRequest: request });
    expect(wrapper.state('currentRequest')).toEqual(request);
    const btncancelRidePost = wrapper.find('#btnCancelRide');
    expect(btncancelRidePost.exists()).toBe(true);
  });


  test('Clicking <btnCancel> cancels currentRequest', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ currentRequest: request });
    const btncancelRide = wrapper.find('#btnCancelRide');
    btncancelRide.simulate('click');
    wrapper.update();
    expect(wrapper.state('currentRequest')).toEqual(null);
  });

  test('Clicking <btnCancel> cancels reverts to <btnRequestRide>', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ currentRequest: request });
    const btncancelRide = wrapper.find('#btnCancelRide');
    btncancelRide.simulate('click');
    wrapper.update();
    const btncancelRideClicked = wrapper.find('#btnCancelRide');
    expect(btncancelRideClicked.exists()).toBe(false);
  });
});

describe('Dispatcher login button functionality', () => {
  test('<btnDispatcherLogin> changes viewmode to DispatcherLogin', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    const btnDispatcherLogin = wrapper.find('#btnDispatcherLogin');
    btnDispatcherLogin.simulate('click');
    wrapper.update();
    expect(wrapper.state('viewmode')).toEqual('DispatcherLogin');
  });

  test('<btnDispatcherLogin> is present if viewmode is UserStart', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ viewmode: 'UserStart' });
    wrapper.update();
    const btnDispatcherLogin = wrapper.find('#btnDispatcherLogin');
    expect(btnDispatcherLogin.exists()).toBe(true);
  });
});

describe('Login View functionality', () => {
  test('Login view renders correctly', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ viewmode: 'DispatcherLogin' });
    wrapper.update();
    const formControlsText = wrapper.find('#formControlsText');
    const btnDispatcherLoginFinal = wrapper.find('#btnDispatcherLoginFinal');
    const btnCancelLogin = wrapper.find('#btnCancelLogin');
    expect(formControlsText.exists()).toBe(true);
    expect(btnDispatcherLoginFinal.exists()).toBe(true);
    expect(btnCancelLogin.exists()).toBe(true);
  });

  test('Login fails if password is incorrect', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ viewmode: 'DispatcherLogin' });

    const formControlsText = wrapper.find('#formControlsText');
    formControlsText.simulate('change', { target: { value: 'abc123' } });

    const btnDispatcherLoginFinal = wrapper.find('#btnDispatcherLoginFinal');
    btnDispatcherLoginFinal.simulate('click');
    wrapper.update();
    expect(wrapper.state('viewmode')).toEqual('DispatcherLogin');
  });

  test('Login Cancel returns to userview', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ viewmode: 'DispatcherLogin' });
    const btnCancelLogin = wrapper.find('#btnCancelLogin');
    btnCancelLogin.simulate('click');
    wrapper.update();
    expect(wrapper.state('viewmode')).toEqual('UserStart');
  });

  test('Login Cancel clears inputed passwords', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ viewmode: 'DispatcherLogin' });
    const btnCancelLogin = wrapper.find('#btnCancelLogin');
    btnCancelLogin.simulate('click');
    wrapper.update();
    expect(wrapper.state('password')).toEqual('');
  });
});

describe('DispatcherMode functionality', () => {
  test('DispatcherMode renders properly', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ viewmode: 'DispatcherMode' });
    const btnAddRide = wrapper.find('#btnAddRide');
    const btnLogout = wrapper.find('#btnLogout');
    const qvActive = wrapper.find('#qvActive');
    const qvPickedUp = wrapper.find('#qvPickedUp');
    expect(btnAddRide.exists()).toBe(true);
    expect(btnLogout.exists()).toBe(true);
    expect(qvActive.exists()).toBe(true);
    expect(qvPickedUp.exists()).toBe(true);
  });

  test('<btnAddRide> changes viewmode to RequestRideDispatcher', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ viewmode: 'DispatcherMode' });
    const btnAddRide = wrapper.find('#btnAddRide');
    btnAddRide.simulate('click');
    wrapper.update();
    expect(wrapper.state('viewmode')).toEqual('RequestRideDispatcher');
  });

  test('<btnLogout> changes viewmode to UserStart', () => {
    const wrapper = shallow(<ContentArea complete={jest.fn} />);
    wrapper.setState({ viewmode: 'DispatcherMode' });
    const btnLogout = wrapper.find('#btnLogout');
    btnLogout.simulate('click');
    wrapper.update();
    expect(wrapper.state('viewmode')).toEqual('UserStart');
  });
});

jest.useFakeTimers();
describe('Interval functionality', () => {
  test('interval occurs every second', () => {
    const wrapper = shallow(<ContentArea // eslint-disable-line no-unused-vars
      complete={jest.fn}
    />);

    // 18 was selected because of unseen calls to componentDidMount
    expect(setInterval).toHaveBeenCalledTimes(17);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });
});
