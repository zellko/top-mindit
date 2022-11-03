import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Post from '../Post/Post';
import CreateComment from './CreateComment/CreateComment';
import CommentCard from './CommentCard/CommentCard';
import './Comments.css';

function Comments({ writeCommentToDb }) {
  const params = useParams();
  console.log(params);
  const data = useLocation();
  console.log(data.state);

  const [postContentData, setPostContentData] = useState();
  const [authorData, setAuthorData] = useState();

  // componentDidMount/ update
  useEffect(() => {
    console.log('render');

    // if data are provided, set postData
    if (data.state) {
      setPostContentData(data.state.postContent);
      setAuthorData(data.state.author);
    }
    // ... else fetch post data from DB
    // ... and fetch user data from DB
  }, [postContentData]);

  function renderPostReply() {
    console.log(postContentData);

    if (postContentData === undefined) return null;
    if (!postContentData.comments) {
      return (
        <div className="no-comment-message">
          <p>No comment for now!</p>
          <p>Be the first one to share what you think!</p>
        </div>
      );
    }

    if (postContentData.comments.length > 0) {
      return (
        postContentData.comments.map((commentData) => (
          <CommentCard
            key={commentData.commentId}
            data={commentData}
          />
        ))
      );
    }

    return null;
  }

  return (
    <div className="comments">
      <Post
        postData={postContentData}
        authorData={authorData}
      />
      <div className="comments-area">
        <CreateComment
          addCommentToDb={(commentData) => {
            writeCommentToDb(
              postContentData.postId,
              postContentData.authorUUID,
              commentData,
            );
          }}
        />
        {renderPostReply()}

      </div>
      Comments.js
      <br />
      <br />
      postID:
      {' '}
      {params.postid}
    </div>
  );
}

export default Comments;
