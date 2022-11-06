import React, { useState } from 'react';
import CreateComment from '../CreateComment/CreateComment';
import './CommentCard.css';
import imgComment from '../../../img/comment.png';

function CommentCard({ data, addReplyToDb }) {
  const [showCommentForm, setShowCommentForm] = useState(false);

  function countLike() {
    if (data.like) {
      return data.like.length;
    }

    return 0;
  }

  function countReply() {
    console.log('To Do');
    return 99;
  }

  function toggleCommentForm() {
    showCommentForm
      ? setShowCommentForm(false)
      : setShowCommentForm(true);
  }

  return (
    <div className="comment-card" id={data.commentId}>
      <div className="comment-card-content">
        <div className="comment-card-header">
          <p>{data.author}</p>
          <span>{data.timestamp}</span>
        </div>

        <div className="comment-card-text">
          <p>
            {' '}
            {data.commentText}
          </p>

        </div>

        <div className="post-content-social">
          <div className="social-like">
            <button type="button" onClick={() => { console.log('todo like'); }}>
              <svg
                alt="Like post"
                viewBox="0 0 24 24"
                style={{
                  width: '16px',
                  height: '16px',
                  color: 'grey',
                }}
              >
                <path fill="currentColor" d="M12.1 18.55L12 18.65L11.89 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 6 11.07 7.36H12.93C13.46 6 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55M16.5 3C14.76 3 13.09 3.81 12 5.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5C2 12.27 5.4 15.36 10.55 20.03L12 21.35L13.45 20.03C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z" />
              </svg>
            </button>
            <p>{countLike()}</p>
          </div>
          <div className="social-comment">
            <button type="button" onClick={toggleCommentForm}>
              <img src={imgComment} alt="Comment post" />
            </button>
            <p>{countReply()}</p>
          </div>
        </div>
      </div>

      {showCommentForm ? (
        <CreateComment
          addCommentToDb={(formData) => {
            const commentData = formData;
            commentData.replyTo = data.commentId;
            addReplyToDb(commentData);
          }}
        />
      ) : null}

    </div>
  );
}

export default CommentCard;
