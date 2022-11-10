import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { UserDataContext } from '../../UserDataContext';
import Post from '../Post/Post';
import CreateComment from './CreateComment/CreateComment';
import CommentCard from './CommentCard/CommentCard';
import './Comments.css';

function convertObjectToArray(commentsObject) {
  const array = [];
  const objectKeys = Object.keys(commentsObject);

  for (let index = 0; index < objectKeys.length; index++) {
    const key = objectKeys[index];
    array.push(commentsObject[key]);
  }
  return array;
}

function Comments({ writeCommentToDb, writeLikeToDb, writePostLikeToDb }) {
  const params = useParams();
  const data = useLocation();
  const getContext = useContext(UserDataContext);
  const { userData, userFollow } = getContext;

  const [postContentData, setPostContentData] = useState(
    // Set state with an object with "comments" keys, create an empty array to avoid error
    {
      comments: [],
    },
  );
  const [authorData, setAuthorData] = useState();

  // componentDidMount/ update
  useEffect(() => {
    console.log('render');

    // if data are provided, set postData
    if (data.state) {
      const postData = data.state.postContent;
      console.log(postData);

      // In case postData object has no "comments" keys, create an empty array to avoid error
      if (postData.comments === undefined) {
        postData.comments = [];
      }

      const commentsToArray = convertObjectToArray(postData.comments);
      postData.comments = commentsToArray;
      setPostContentData(postData);
      setAuthorData(data.state.author);
    }

    // ... else fetch post data from DB
    // ... and fetch user data from DB
  }, []);

  return (

    <div className="comments">
      <Post
        postData={postContentData}
        authorData={authorData}
        handlePostLike={() => {
          writePostLikeToDb(postContentData.postId, postContentData.authorUUID);
        }}
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

        { postContentData.comments.map((commentData) => {
          function isReply(replyData) {
            // This recursive function, check if the "CommentCard" being rendered has reply

            // Filter all the comments to find the one who are responding...
            // ...to the "CommentCard" being rendered now
            const commentReply = postContentData.comments.filter((a) => {
              if (a.replyTo !== undefined) {
                if (a.replyTo === replyData.commentId) { return a; }
              }
            });

            // If there is one or more reply...
            if (commentReply.length > 0) {
              return (
                commentReply.map((reply) => (
                  // For each reply...
                  // ... render a nested "CommentCard"
                  <div className="comment-reply" key={reply.commentId}>
                    <div className="reply-side-bar" />
                    <CommentCard
                      key={reply.commentId}
                      data={reply}
                      addReplyToDb={(formReplyData) => {
                        writeCommentToDb(
                          postContentData.postId,
                          postContentData.authorUUID,
                          formReplyData,
                        );
                      }}
                      addLikeToDb={() => {
                        console.log('fddsfsd');
                        writeLikeToDb(
                          postContentData.postId,
                          postContentData.authorUUID,
                          reply.commentId,
                        );
                      }}
                    />
                    {/* ... recall isReply function to check if this reply has reply */}
                    {isReply(reply)}
                  </div>
                ))
              );
            }
          }

          // If the comment is not a reply to another comment...
          if (!commentData.replyTo) {
            return (
            // ... render a "CommentCard"
              <div className="reply-container" key={commentData.commentId}>
                <div className="reply-side-bar" />
                <CommentCard
                  key={commentData.commentId}
                  data={commentData}
                  addReplyToDb={(formReplyData) => {
                    writeCommentToDb(
                      postContentData.postId,
                      postContentData.authorUUID,
                      formReplyData,
                    );
                  }}
                  addLikeToDb={() => {
                    console.log('fddsfsd');
                    writeLikeToDb(
                      postContentData.postId,
                      postContentData.authorUUID,
                      commentData.commentId,
                    );
                  }}
                />
                {/* ...Call isReply function to check if this comment as reply */}
                {isReply(commentData)}
              </div>
            );
          }
        })}
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
