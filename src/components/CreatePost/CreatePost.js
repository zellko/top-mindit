import React, { useState, useEffect, useContext } from 'react';
import { UserDataContext } from '../../UserDataContext';
import './CreatePost.css';

function CreatePost({ addPostToDb }) {
  const UserData = useContext(UserDataContext);

  // componentDidMount
  useEffect(() => {
    const input = document.querySelector('.create-post input');
    const closeButton = document.querySelector('.form-extend-close');
    const divTextarea = document.querySelector('.create-post form > :last-child');

    input.addEventListener('focusin', () => {
      divTextarea.classList.add('show-create-post');
    });

    closeButton.addEventListener('click', () => {
      divTextarea.classList.remove('show-create-post');
    });

    // componentWillUnmount
    return () => {
      input.removeEventListener('focus', () => {});
    };
  }, []);

  function onSubmit() {
    const postTitle = document.querySelector('.create-post input');
    const postContent = document.querySelector('.create-post textarea');

    if (postTitle.value.length === 0 || postContent.value.length === 0) return;
    if (!UserData.userUUID) return;

    addPostToDb({
      title: postTitle.value,
      content: postContent.value,
      authorUUID: UserData.userUUID,
      postId: `${UserData.userUUID.slice(0, 8)}-${Math.round(Math.random() * 1000000)}`,
    });
  }

  return (
    <div className="create-post">
      <form>
        <div>
          {/* <img src={`${UserData.userprofilePicture}?sz=150`} referrerPolicy="no-referrer" alt="User profile" /> */}
          <input placeholder="Create Post" />
        </div>

        <div className="form-extend">
          <textarea rows="5" />
          <button type="button" onClick={onSubmit}>Submit</button>
          <div className="form-extend-close">▲</div>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
