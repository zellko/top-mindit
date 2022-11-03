import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Pill from '../Pill/Pill';
import { UserDataContext } from '../../UserDataContext';
import './Post.css';
import defaultProfileImg from '../../img/profile_default.jpg';
import imgComment from '../../img/comment.png';
import imgShare from '../../img/share.png';

const undefinedUserdata = {
  isFirstLogin: false,
  userBio: undefined,
  userName: undefined,
  userTopic: [],
  userUUID: '',
  userprofilePicture: defaultProfileImg,
};

function Post({ postData, authorData, handlePostLike }) {
  const topicArray = postData.topics;
  let userDataChecked = authorData;
  const getContext = useContext(UserDataContext);
  const { userData, userFollow } = getContext;

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

  function handleComment() {
    console.log('handleComment');
  }

  function handleShare() {
    console.log('handleShare');
  }

  function handleLikeClick() {
    if (!userData.userUUID) {
      console.log('User is not logged, ignore like');
      return;
    }

    handlePostLike();
  }

  function countLike() {
    if (postData.like) {
      return postData.like.length;
    }

    return 0;
  }

  function isPostLiked() {
    if (postData.like) {
      if (postData.like.includes(userData.userUUID)) {
        return '#ea0027';
      }
    }

    return '#D7DADC';
  }

  if (authorData === undefined) {
    // If user data are undefined, use blank data
    // ... avoid crash when data are loading
    userDataChecked = undefinedUserdata;
  } else if (authorData.userprofilePicture === 'null') {
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
        <div className="post-content-social">
          <div className="social-like">
            <button type="button" onClick={handleLikeClick}>
              <svg
                alt="Like post"
                viewBox="0 0 24 24"
                style={{
                  width: '16px',
                  height: '16px',
                  color: isPostLiked(),
                }}
              >
                <path fill="currentColor" d="M12.1 18.55L12 18.65L11.89 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 6 11.07 7.36H12.93C13.46 6 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55M16.5 3C14.76 3 13.09 3.81 12 5.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5C2 12.27 5.4 15.36 10.55 20.03L12 21.35L13.45 20.03C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z" />
              </svg>
            </button>
            <p>{countLike()}</p>
          </div>
          <div className="social-comment">
            <button type="button">
              <img src={imgComment} alt="Comment post" />
            </button>
            <p>3</p>
          </div>
          <div className="social-share">
            <button type="button">
              <img src={imgShare} alt="Share post link" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
