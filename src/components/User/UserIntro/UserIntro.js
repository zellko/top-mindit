import React, { useState, useEffect, useContext } from 'react';
import { UserDataContext } from '../../../UserDataContext';
import Pill from '../../Pill/Pill';
import './UserIntro.css';

function UserIntro({ data, editProfile, addUserToFollowed }) {
  const UserData = useContext(UserDataContext);
  const [profileImage, setProfileImage] = useState('');

  const {
    userName, userprofilePicture, userBio, userTopic, userUUID,
  } = data;

  function renderButton() {
    if (!UserData.userUUID) {
      return null;
    }

    if (UserData.userUUID === userUUID) {
      return (
        <button type="button" onClick={editProfile}>Edit</button>
      );
    }

    return (
      <button type="button" onClick={addUserToFollowed}>Follow</button>
    );
  }

  return (
    <div className="user-intro">
      <div className="user-intro-banner" />
      <div className="user-intro-header">
        <img src={`${userprofilePicture}?sz=150`} referrerPolicy="no-referrer" alt="User Profile" />
        <div className="user-intro-name">
          <div>
            <h1>
              {userName}
            </h1>
            {renderButton()}
          </div>
          <p>Karma: </p>
        </div>

      </div>
      <p>{userBio}</p>
      <div className="user-intro-topics">
        <p>Main Thought: </p>
        {userTopic.map((topic) => (
          <Pill text={topic} pillColor="" key={topic} />
        ))}
        <p />
      </div>
    </div>
  );
}

export default UserIntro;
