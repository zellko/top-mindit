import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Post from '../Post/Post';
import CreateComment from './CreateComment/CreateComment';
import CommentCard from './CommentCard/CommentCard';
import './Comments.css';

function Comments({ writeCommentToDb }) {
  const params = useParams();
  const data = useLocation();

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

      // In case postData object has no "comments" keys, create an empty array to avoid error
      if (postData.comments === undefined) {
        postData.comments = [];
      }

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
