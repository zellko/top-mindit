import React, { createContext } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UserIntro from './UserIntro';
import { UserDataContext } from '../../../UserDataContext';

const mockUserData = {
  userName: 'test Name',
  userUUID: '1234',
  userBio: 'test Bio',
  userprofilePicture: 'url',
  userTopic: ['TDD', 'Is', 'Fun'],
  isFirstLogin: true,
};

describe('UserIntro: Component Rendering', () => {
  it('Should render UserIntro', () => {
    const { container } = render(
      <UserIntro
        data={mockUserData}
      />,
    );

    const name = screen.getByText('test Name');
    const bio = screen.getByText('test Bio');
    const img = container.querySelector('img');
    const karma = screen.getByText('Karma:');
    const topicA = screen.getByText('TDD');
    const topicB = screen.getByText('Is');
    const topicC = screen.getByText('Fun');

    expect(name).toBeInTheDocument();
    expect(bio).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(karma).toBeInTheDocument();
    expect(topicA).toBeInTheDocument();
    expect(topicB).toBeInTheDocument();
    expect(topicC).toBeInTheDocument();
  });

  it('If user is logged, and it is not is account: Should render UserIntro with "Follow Button"', () => {
    const mockContextData = { userUUID: '0000' };

    render(
      <UserDataContext.Provider value={mockContextData}>
        <UserIntro
          data={mockUserData}
        />
      </UserDataContext.Provider>,
    );

    const buttonFollow = screen.getByRole('button', { name: 'Follow' });

    expect(buttonFollow).toBeInTheDocument();
  });

  it('If user is logged, and it is his account: Should render UserIntro with "Edit Profile Button"', () => {
    const mockContextData = { userUUID: '1234' };

    render(
      <UserDataContext.Provider value={mockContextData}>
        <UserIntro
          data={mockUserData}
        />
      </UserDataContext.Provider>,
    );

    const buttonEdit = screen.getByRole('button', { name: 'Edit' });

    expect(buttonEdit).toBeInTheDocument();
  });
});

describe('UserIntro: Functions', () => {
  it('"Follow" Button button should call function on click', () => {
    const mockContextData = { userUUID: '0000' };
    const mockFunction = jest.fn();

    render(
      <UserDataContext.Provider value={mockContextData}>
        <UserIntro
          data={mockUserData}
          editProfile={{}}
          addUserToFollowed={mockFunction}
        />
      </UserDataContext.Provider>,
    );

    const buttonFollow = screen.getByRole('button', { name: 'Follow' });
    userEvent.click(buttonFollow);

    expect(buttonFollow).toBeInTheDocument();
    expect(mockFunction).toHaveBeenCalled();
  });

  it('"Edit Profile" Button button should call function on click', () => {
    const mockContextData = { userUUID: '1234' };
    const mockFunction = jest.fn();

    render(
      <UserDataContext.Provider value={mockContextData}>
        <UserIntro
          data={mockUserData}
          editProfile={mockFunction}
          addUserToFollowed={{}}
        />
      </UserDataContext.Provider>,
    );

    const buttonEdit = screen.getByRole('button', { name: 'Edit' });
    userEvent.click(buttonEdit);

    expect(buttonEdit).toBeInTheDocument();
    expect(mockFunction).toHaveBeenCalled();
  });
});
