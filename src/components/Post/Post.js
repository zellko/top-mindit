import React from 'react';
import { Link } from 'react-router-dom';
import Pill from '../Pill/Pill';
import './Post.css';
import defaultProfileImg from '../../img/profile_default.jpg';

const undefinedUserdata = {
  isFirstLogin: false,
  userBio: undefined,
  userName: undefined,
  userTopic: [],
  userUUID: '',
  userprofilePicture: defaultProfileImg,
};

function Post({ postData, userData }) {
  const topicArray = postData.topics;
  let userDataChecked = userData;

  function postTime() {
    const secElapsed = (Date.now() - postData.postTimestamp) / 1000;
    const dayElapsed = Math.round(secElapsed / 86400);
    const dayModulo = secElapsed % 86400;
    const hourElapsed = Math.round(dayModulo / 3600);

    if (dayElapsed > 0) {
      return `${dayElapsed} days`;
    }

    if (hourElapsed > 0) {
      return `${hourElapsed} hours`;
    }

    return 'less than 1 hour';
  }

  if (userData === undefined) {
    // If user data are undefined, use blank data
    // ... avoid crash when data are loading
    userDataChecked = undefinedUserdata;
  } else if (userData.userprofilePicture === 'null') {
    // If user data are undefined, use blank data
    // ... avoid crash when data are loading
    userDataChecked.userprofilePicture = defaultProfileImg;
  }

  return (
    <div className="post">
      <div className="post-sidebar">
        <img src={`${userDataChecked.userprofilePicture}?sz=150`} referrerPolicy="no-referrer" alt="User profile" />
      </div>
      <div className="post-content">
        <div className="post-content-top">
          {postData.title}
          {
            topicArray.map((topic) => (
              <Pill text={topic} pillColor="rgb(241 172 174)" key={topic} />
            ))
          }
        </div>
        <div className="post-content-text">
          {postData.content}
        </div>
        <div className="post-content-bot">
          <Link to={`/user/${userDataChecked.userName}`}>
            {postData.author}
          </Link>
          <span>{`${postTime()} ago`}</span>
        </div>
      </div>
    </div>
  );
}

export default Post;
