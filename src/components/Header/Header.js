import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import googleIcon from '../../img/Google_ G _Logo.png';

function convertFollowToArray(followObject) {
  const followArray = [];

  const keys = Object.keys(followObject);

  for (let index = 0; index < keys.length; index++) {
    const uuid = keys[index];
    const userName = followObject[uuid];

    followArray.push([uuid, userName]);
  }

  return followArray;
}

function returnCurrentPage(pathname) {
  switch (pathname) {
    case '/all/users':
      return 'All Users';

    case '/all/posts':
      return 'All Posts';

    case '/':
      return 'Home';

    default:
      return 'User';
  }
}

function toggleNavMenu() {
  const navMenu = document.querySelector('.nav-dropdown-content');
  navMenu.classList.toggle('show');
}

function toggleProfileMenu() {
  const navMenu = document.querySelector('.profile-dropdown-content');
  navMenu.classList.toggle('show');
}

function hideMenu(menu) {
  const navMenu = document.querySelector(`.${menu}-dropdown-content`);
  navMenu.classList.remove('show');
}

function Header({
  userData, userFollow, onLogInClick, onLogOutClick, pathname,
}) {
  const [userFollowArray, setUserFollowArray] = useState([]);

  // componentDidMount
  useEffect(() => {
    setUserFollowArray(convertFollowToArray(userFollow));

    const dropdownNavButton = document.querySelector('.nav-dropdown-btn');
    dropdownNavButton.addEventListener('click', toggleNavMenu);

    const dropdownContent = document.querySelector('.nav-dropdown-content');
    dropdownContent.addEventListener('click', () => hideMenu('nav'));

    // componentWillUnmount
    return () => {
      dropdownNavButton.removeEventListener('click', toggleNavMenu);
      dropdownContent.removeEventListener('click', hideMenu);
    };
  }, []);

  // componentDidUpdate
  useEffect(() => {
    // When user login, update the User Follow State
    setUserFollowArray(convertFollowToArray(userFollow));

    // If user is logged, add eventListener to profile dropdown menu
    let dropdownProfileBtn;
    let dropdownProfileContent;
    if (userData.userUUID) {
      dropdownProfileBtn = document.querySelector('.profile-dropdown-header');
      dropdownProfileBtn.addEventListener('click', toggleProfileMenu);

      dropdownProfileContent = document.querySelector('.profile-dropdown-content');
      dropdownProfileContent.addEventListener('click', () => hideMenu('profile'));
    }
  }, [userFollow]);

  function isUserLogged() {
    const { userUUID, userName } = userData;

    // If user is logged in, render "Log Out" and "Profile" button
    if (userUUID) {
      return (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <img src={`${userData.userprofilePicture}?sz=150`} referrerPolicy="no-referrer" alt="User profile" />
            <button className="profile-dropdown-btn" type="button">{userData.userName}</button>
          </div>
          <div className="profile-dropdown-content">
            <button type="button" className="header-btn-profile">
              <Link to={`/user/${userName}`} state={userData}>Profile</Link>
            </button>
            <button type="button" onClick={onLogOutClick}>Log Out</button>
          </div>
        </div>
      );
    }

    // ...else, render "Log In" button
    return (
      <div>
        <button type="button" onClick={onLogInClick}>
          <img src={googleIcon} alt="Google Icon" />
          Log In
        </button>
      </div>
    );
  }

  function checkForFollow() {
    // If user is not logged in, render bellow message on the hamburger menu
    if (!userData.userUUID) {
      return (
        <p className="nav-dropdown-follow">Log In to see followed users</p>
      );
    }

    // If user is not following any other users,
    // ...render bellow message on the hamburger menu
    if (userFollowArray.length === 0) {
      return (
        <p className="nav-dropdown-follow">Users your follow will appear here</p>
      );
    }

    // else return null
    return (
      null
    );
  }

  return (
    <div className="header">
      <h1>
        <Link to="/">
          Mind
          <span>It</span>
        </Link>
      </h1>
      <div className="nav-dropdown">
        <button className="nav-dropdown-btn" type="button">
          {returnCurrentPage(pathname)}
        </button>
        <div className="nav-dropdown-content">
          <p className="nav-dropdown-category">FEEDS</p>
          <p><Link to="/all/posts">All Posts</Link></p>
          <p><Link to="/all/users">All Users</Link></p>
          <p className="nav-dropdown-category">FOLLOWED</p>
          {checkForFollow()}
          {
              userFollowArray.map((follow) => (
                <p key={follow[0]}>
                  <Link
                    to={`/user/${follow[1]}`}
                    key={follow[0]}
                    state={
                {
                  userName: follow[1],
                  userUUID: follow[0],
                }
                    }
                  >
                    {follow[1]}
                  </Link>
                </p>
              ))
          }
        </div>
      </div>

      {isUserLogged()}

    </div>
  );
}

export default Header;
