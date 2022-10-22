import React from 'react';
import ReactDOM from 'react-dom/client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BrowserRouter, MemoryRouter, Routes, Route,
} from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import User from './User';

const mockUserData = {
  userName: 'testYorick',
  userUUID: '1234',
  userBio: 'test Bio',
  userprofilePicture: 'url',
  userTopic: ['TDD', 'Is', 'Fun'],
  isFirstLogin: true,
};

const mockUserList = {
  1234: 'testYorick',
};

const mockUserPost = {
  1234: 'testYorick',
};

const mockUserFollow = {
  uuid123xyz: 'test Name',
};

describe('User: Component Rendering', () => {
  it.todo('If user is not found: Should render message "User Not found..."');
  it.todo('If posts are not found: Should render message "Post not found..."');
  it.todo('If user is found: Should render UserIntro');
  it.todo('If post are found: Should render UserPost');
});

describe('UserIntro: Functions', () => {
  it.todo('"Follow" Button button should call function on click');
});
