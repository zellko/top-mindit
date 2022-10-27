import React from 'react';
import { Link } from 'react-router-dom';
import Pill from '../Pill/Pill';
import './Post.css';

function Post({ postData, userData }) {
  const topicArray = postData.topics;

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

  return (
    <div className="post">
      <div className="post-sidebar">
        <img src={`${userData.userprofilePicture}?sz=150`} referrerPolicy="no-referrer" alt="User profile" />
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
          <Link to={`/user/${userData.userName}`}>
            {postData.author}
          </Link>
          <span>{`${postTime()} ago`}</span>
        </div>
      </div>
    </div>
  );
}

export default Post;
