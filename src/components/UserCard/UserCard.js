import React, { useContext } from 'react';
import './UserCard.css';
import { Link } from 'react-router-dom';
import { UserDataContext } from '../../UserDataContext';
import defaultProfileImg from '../../img/profile_default.jpg';
import Pill from '../Pill/Pill';

const undefinedUserdata = {
  isFirstLogin: false,
  userBio: undefined,
  userName: undefined,
  userTopic: [],
  userUUID: '',
  userprofilePicture: defaultProfileImg,
  userprofileBanner: '0',
};

function UserCard({ userCardData, addUserToFollowed }) {
  const getContext = useContext(UserDataContext);
  const { userData, userFollow } = getContext;
  let userDataChecked = userCardData;

  if (userCardData === undefined) {
    // If user data are undefined, use blank data
    // ... avoid crash when data are loading
    userDataChecked = undefinedUserdata;
  } else if (userCardData.userprofilePicture === 'null') {
    // If user data are undefined, use blank data
    // ... avoid crash when data are loading
    userDataChecked.userprofilePicture = defaultProfileImg;
  }

  function renderPills(topicArray) {
    return (
      topicArray.map((topic) => (
        <Pill text={topic} key={topic} />
      ))
    );
  }

  function renderFollowBtn() {
    // If it's the card of logged user, do not render follow button
    if (userData.userUUID === userCardData.userUUID) return null;

    // If the card from user rendered is already followed, render "unfollow"
    const followedUsersUUID = Object.keys(userFollow);
    if (followedUsersUUID.includes(String(userCardData.userUUID))) {
      return (
        <button
          type="button"
          onClick={(e) => {
            const { id, name } = e.target.attributes;

            addUserToFollowed([id.value, name.value]);
          }}
          id={userDataChecked.userUUID}
          name={userDataChecked.userName}
        >
          Unfollow
        </button>
      );
    }

    // If the card from user rendered is not followed, render "follow"
    if (userData.userUUID) {
      return (
        <button
          type="button"
          onClick={(e) => {
            const { id, name } = e.target.attributes;

            addUserToFollowed([id.value, name.value]);
          }}
          id={userDataChecked.userUUID}
          name={userDataChecked.userName}
        >
          Follow
        </button>
      );
    }

    return null;
  }

  return (
    <div className="user-card">
      <div
        className="user-card-banner"
        style={{ backgroundImage: `url(${userDataChecked.userprofileBanner})` }}
      >
        <img
          src={`${userDataChecked.userprofilePicture}?sz=150`}
          referrerPolicy="no-referrer"
          alt="User Profile"
        />
        <div>
          <Link to={`/user/${userDataChecked.userName}`}>
            <h1>{userDataChecked.userName}</h1>
          </Link>
        </div>
        {renderFollowBtn()}
      </div>
      <div className="user-card-content">
        <p>
          {userDataChecked.userBio}
        </p>
        <div className="user-card-topic">
          Main Thought:
          {renderPills(userDataChecked.userTopic)}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
