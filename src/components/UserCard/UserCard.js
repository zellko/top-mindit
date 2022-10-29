import React from 'react';
import './UserCard.css';
import { Link } from 'react-router-dom';
import defaultProfileImg from '../../img/profile_default.jpg';
import Pill from '../Pill/Pill';

const undefinedUserdata = {
  isFirstLogin: false,
  userBio: undefined,
  userName: undefined,
  userTopic: [],
  userUUID: '',
  userprofilePicture: defaultProfileImg,
};

const testBG = 'url("https://cdn.pixabay.com/photo/2015/10/29/14/38/web-1012467__340.jpg")';

function UserCard({ userData, addUserToFollowed }) {
  let userDataChecked = userData;

  if (userData === undefined) {
    // If user data are undefined, use blank data
    // ... avoid crash when data are loading
    userDataChecked = undefinedUserdata;
  } else if (userData.userprofilePicture === 'null') {
    // If user data are undefined, use blank data
    // ... avoid crash when data are loading
    userDataChecked.userprofilePicture = defaultProfileImg;
  }

  function renderPills(topicArray) {
    return (
      topicArray.map((topic) => (
        <Pill text={topic} />
      ))
    );
  }
  return (
    <div className="user-card">
      <div
        className="user-card-banner"
        style={{ backgroundImage: testBG }}
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
        <button
          type="button"
          onClick={(e) => {
            const { id, name } = e.target.attributes;

            addUserToFollowed({ [id.value]: name.value });
          }}
          id={userDataChecked.userUUID}
          name={userDataChecked.userName}
        >
          Follow

        </button>
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
