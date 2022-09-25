import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

const mockUserData = {
  userName: 'test Name',
  userUUID: 'test UUID',
  userBio: 'test Bio',
  userprofilePicture: 'url',
  userTopic: ['TDD', 'Is', 'Fun'],
  isFirstLogin: true,
};

const mockUserFollow = {
  uuid123xyz: 'test Name',
};

describe('Header: Component Rendering', () => {
  it('If user is not logged, "Log In" button should render', () => {
    render(
      <BrowserRouter>
        <Header userData={{}} userFollow={{}} />
      </BrowserRouter>,
    );

    const button = screen.getByRole('button', { name: 'Log In' });

    expect(button).toBeInTheDocument();
  });

  it('If user is not logged, "a special message" should render in "FOLLOWED" section', () => {
    render(
      <BrowserRouter>
        <Header userData={{}} userFollow={{}} />
      </BrowserRouter>,
    );

    const followOption = screen.getByText('Log In to see followed users');

    expect(followOption).toBeInTheDocument();
  });

  it('If user is logged, "Log Out" button should render', () => {
    render(
      <BrowserRouter>
        <Header userData={mockUserData} userFollow={{}} />
      </BrowserRouter>,
    );

    const button = screen.getByRole('button', { name: 'Log Out' });

    expect(button).toBeInTheDocument();
  });

  it('If user is logged, "profile" button should render', () => {
    const { container } = render(
      <BrowserRouter>
        <Header userData={mockUserData} userFollow={{}} />
      </BrowserRouter>,
    );

    const buttonProfile = container.querySelector('.header-btn-profile');

    expect(buttonProfile).toBeInTheDocument();
  });

  it('If user is logged, "Followed" users should render in select menu', () => {
    render(
      <BrowserRouter>
        <Header userData={mockUserData} userFollow={mockUserFollow} />
      </BrowserRouter>,
    );

    const followOption = screen.getByText('test Name');
    expect(followOption).toBeInTheDocument();
  });

  it('If user has no follow, "a special message" should render in "FOLLOWED" section', () => {
    render(
      <BrowserRouter>
        <Header userData={mockUserData} userFollow={{}} />
      </BrowserRouter>,
    );

    const followOption = screen.getByText('Users your follow will appear here');
    expect(followOption).toBeInTheDocument();
  });
});

describe('Header: Functions', () => {
  it('Log In button should call function on click', () => {
    const mockFunction = jest.fn();

    render(
      <BrowserRouter>
        <Header
          userData={{}}
          userFollow={{}}
          onLogInClick={mockFunction()}
        />
      </BrowserRouter>,
    );

    const button = screen.getByRole('button', { name: 'Log In' });

    userEvent.click(button);

    expect(mockFunction).toHaveBeenCalled();
  });

  it('Log Out button should call function on click', () => {
    const mockFunction = jest.fn();

    render(
      <BrowserRouter>
        <Header
          userData={mockUserData}
          userFollow={{}}
          onLogInClick={{}}
          onLogOutClick={mockFunction}
        />
      </BrowserRouter>,
    );

    const button = screen.getByRole('button', { name: 'Log Out' });

    userEvent.click(button);

    expect(mockFunction).toHaveBeenCalled();
  });
});
