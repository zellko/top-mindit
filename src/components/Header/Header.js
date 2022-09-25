import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

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

function toggleNavMenu() {
  const navMenu = document.querySelector('.nav-dropdown-content');
  navMenu.classList.toggle('show');
}

function hideNavMenu() {
  const navMenu = document.querySelector('.nav-dropdown-content');
  navMenu.classList.remove('show');
}

function Header({
  userData, userFollow, onLogInClick, onLogOutClick,
}) {
  const [userFollowArray, setUserFollowArray] = useState([]);

  // componentDidMount
  useEffect(() => {
    setUserFollowArray(convertFollowToArray(userFollow));

    const dropdownButton = document.querySelector('.nav-dropdown-btn');
    dropdownButton.addEventListener('click', toggleNavMenu);

    const dropdownContent = document.querySelector('.nav-dropdown-content');
    dropdownContent.addEventListener('click', hideNavMenu);

    // componentWillUnmount
    return () => {
      dropdownButton.removeEventListener('click', toggleNavMenu);
      dropdownContent.removeEventListener('click', hideNavMenu);
    };
  }, []);

  // componentDidUpdate
  useEffect(() => {
    setUserFollowArray(convertFollowToArray(userFollow));
  }, [userFollow]);

  function isUserLogged() {
    // Check if user is logged in when the page render
    const { userUUID } = userData;

    // If user is logged in, render "Log Out" and "Profile" button
    if (userUUID) {
      return (
        <div>
          <button type="button" onClick={onLogOutClick}>Log Out</button>
          <button type="button" className="header-btn-profile">
            <Link to={`/user/${userUUID}`}>Profile</Link>
          </button>
        </div>
      );
    }

    // ...else, render "Log In" button
    return (
      <div>
        <button type="button" onClick={onLogInClick}>Log In</button>
      </div>

    );
  }

  function checkForFollow() {
    // If user is not logged in, render as special message on the select optgroup "FOLLOWED"
    if (!userData.userUUID) {
      return (
        <p>Log In to see followed users</p>
      );
    }

    // If user is not following any other users,
    // ...render as special message on the select optgroup "FOLLOWED"
    if (userFollowArray.length === 0) {
      return (
        <p>Users your follow will appear here</p>
      );
    }

    // else return null
    return (
      null
    );
  }

  return (
    <div className="header">
      <h1>MindIt</h1>

      <div className="nav-dropdown">
        <button className="nav-dropdown-btn" type="button">NavSelector</button>
        <div className="nav-dropdown-content">
          <p>FEEDS</p>
          <p><Link to="/all/posts">All Popular Posts</Link></p>
          <p><Link to="/all/users">All Popular Users</Link></p>
          <p>FOLLOWED</p>
          {checkForFollow()}
          {
              userFollowArray.map((follow) => (
                <p key={follow[0]}>
                  <Link to={`/user/${follow[0]}`} key={follow[1]}>
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
