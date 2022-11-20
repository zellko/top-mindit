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

function Comments({
  writeCommentToDb, writeLikeToDb, writePostLikeToDb, loadAllPost, loadUserData, deleteData,
}) {
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
    // if data are provided, set postData
    if (data.state) {
      const postData = data.state.postContent;

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
    async function dbLoadAuthorData(authorUUID) {
      const dbData = await loadUserData(authorUUID);
      setAuthorData(dbData);
    }

    async function dbLoadAllPost() {
      // Load all posts for database
      const dbData = await loadAllPost();
      const dbEntries = Object.entries(dbData);

      for (let index = 0; index < dbEntries.length; index++) {
        // Extract all post from each users
        const element = dbEntries[index];
        const elementEntries = Object.entries(element[1]);

        // ... and for each post, check if post ID match params
        for (let i = 0; i < elementEntries.length; i++) {
          const postId = elementEntries[i];

          if (params.postid === String(postId[0])) {
            // ... if a post from database match params...

            // ...In case postData object has no "comments" keys, ...
            // ... create an empty array to avoid error
            if (postId[1].comments === undefined) {
              postId[1].comments = [];
            }

            const commentsToArray = convertObjectToArray(postId[1].comments);
            postId[1].comments = commentsToArray;

            // ... set state with post data
            setPostContentData(postId[1]);

            // ...fetch post author data
            dbLoadAuthorData(postId[1].authorUUID);
          }
        }
      }
      return dbData;
    }

    dbLoadAllPost();

    // ... and fetch user data from DB
  }, [userData]);

  function isComment() {
    if (postContentData.comments.length === 0 && postContentData.postId) {
      return (
        <div className="no-data">
          <p>No comments yet</p>
          <br />
          <p>Be the first to share what you think!</p>
        </div>
      );
    }
    return null;
  }

  function isPostFound() {
    if (postContentData.postId) {
      return (
        <CreateComment
          addCommentToDb={(commentData) => {
            if (postContentData.postId === undefined) return;

            writeCommentToDb(
              postContentData.postId,
              postContentData.authorUUID,
              commentData,
            );
          }}
        />
      );
    }

    return (
      <div className="no-data">
        <p>No post found</p>
      </div>
    );
  }

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

        {isPostFound()}

        {isComment()}
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
                        writeLikeToDb(
                          postContentData.postId,
                          postContentData.authorUUID,
                          reply.commentId,
                        );
                      }}
                      deleteComment={(commentId) => {
                        const path = `/posts/${postContentData.authorUUID}/${postContentData.postId}/comments`;
                        deleteData(path, commentId);
                      }}
                    />
                    {/* ... recall isReply function to check if this reply has reply */}
                    {isReply(reply)}
                  </div>
                ))
              );
            }
          }

          // ToDo, If a comment reply do not correspond to any comment Id
          // ... it's mean that the comment has been deleted,
          // ... so the comment should be displayed in a special way to handle this case
          // console.log(postContentData.comments);
          // console.log(commentData);
          const commentIdArray = [];

          for (let index = 0; index < postContentData.comments.length; index++) {
            const element = postContentData.comments[index];
            commentIdArray.push(element.commentId);
          }

          if (!commentIdArray.includes(commentData.replyTo) && commentData.replyTo) {
            console.log('Comment reply has been deleted');
            return (
            // ... render a "CommentCard"
              <div className="reply-container" key={commentData.commentId}>
                <div className="reply-side-bar" />
                <p className="deleted-comment">Comment has been deleted</p>
                <div className="comment-reply">
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
                      writeLikeToDb(
                        postContentData.postId,
                        postContentData.authorUUID,
                        commentData.commentId,
                      );
                    }}
                    deleteComment={(commentId) => {
                      const path = `/posts/${postContentData.authorUUID}/${postContentData.postId}/comments`;
                      deleteData(path, commentId);
                    }}
                  />
                  {/* ...Call isReply function to check if this comment as reply */}
                  {isReply(commentData)}
                </div>
              </div>
            );
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
                    writeLikeToDb(
                      postContentData.postId,
                      postContentData.authorUUID,
                      commentData.commentId,
                    );
                  }}
                  deleteComment={(commentId) => {
                    const path = `/posts/${postContentData.authorUUID}/${postContentData.postId}/comments`;
                    deleteData(path, commentId);
                  }}
                />
                {/* ...Call isReply function to check if this comment as reply */}
                {isReply(commentData)}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Comments;
