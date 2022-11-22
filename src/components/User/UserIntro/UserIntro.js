import React, { useContext } from 'react';
import { UserDataContext } from '../../../UserDataContext';
import Pill from '../../Pill/Pill';
import './UserIntro.css';
import defaultProfileImg from '../../../img/profile_default.jpg';

const undefinedUserdata = {
  isFirstLogin: false,
  userBio: undefined,
  userName: undefined,
  userTopic: [],
  userUUID: '',
  userprofilePicture: defaultProfileImg,
  userprofileBanner: '0',
};

function UserIntro({ userIntroCardData, editProfile, addUserToFollowed }) {
  const getContext = useContext(UserDataContext);
  const { userData, userFollow } = getContext;

  const {
    userName, userprofilePicture, userBio, userTopic, userUUID, userprofileBanner,
  } = userIntroCardData;

  let userDataChecked = userIntroCardData;

  if (userIntroCardData === undefined) {
    // If user data are undefined, use blank data
    // ... avoid crash when data are loading
    userDataChecked = undefinedUserdata;
  } else if (userIntroCardData.userprofilePicture === 'null') {
    // If user data are undefined, use blank data
    // ... avoid crash when data are loading
    userDataChecked.userprofilePicture = defaultProfileImg;
  }

  function renderButton() {
    if (!userData.userUUID) {
      return null;
    }

    // If user is looking at his home profile, render "Edit" button
    if (userData.userUUID === userUUID) {
      return (
        <button type="button" onClick={editProfile}>Edit</button>
      );
    }

    // If user is already followed, render "unfollow"
    const followedUsersUUID = Object.keys(userFollow);
    if (followedUsersUUID.includes(String(userIntroCardData.userUUID))) {
      return (
        <button
          type="button"
          onClick={() => {
            addUserToFollowed([userUUID, userName]);
          }}
        >
          Unfollow
        </button>
      );
    }

    // If user is not followed, render "follow"
    return (
      <button
        type="button"
        onClick={() => {
          addUserToFollowed([userUUID, userName]);
        }}
      >
        Follow

      </button>
    );
  }

  return (
    <div className="user-intro">
      <div
        className="user-intro-banner"
        style={{ backgroundImage: `url(${userprofileBanner})` }}
      />
      <div className="user-intro-header">
        <img src={`${userprofilePicture}?sz=150`} referrerPolicy="no-referrer" alt="User Profile" />
        <div className="user-intro-name">
          <div>
            <h1>
              {userName}
            </h1>
            {renderButton()}
          </div>
        </div>

      </div>
      <p>{userBio}</p>
      <div className="user-intro-topics">
        <p>Main Thought: </p>
        {userTopic.map((topic) => (
          <Pill text={topic} pillColor="#B6686A" key={topic} />
        ))}
        <p />
      </div>
    </div>
  );
}

export default UserIntro;
