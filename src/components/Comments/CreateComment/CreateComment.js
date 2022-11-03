import React, {
  useEffect, useContext,
} from 'react';
import { UserDataContext } from '../../../UserDataContext';
import './CreateComment.css';

function CreateComment({ addCommentToDb }) {
  const getContext = useContext(UserDataContext);
  const { userData, userFollow } = getContext;

  // componentDidMount
  useEffect(() => {
    console.log('componentDidMount');
    // componentWillUnmount
    return () => {
      console.log('componentWillUnmount');
    };
  }, []);

  function clearForm() {
    const inputText = document.querySelector('.create-comment textarea');

    // Clear form value
    inputText.value = '';
  }

  function onSubmit() {
    const inputText = document.querySelector('.create-comment textarea');

    // Check if text is filled...
    // ... user is logged
    if (inputText.value.length === 0) return;
    if (!userData.userUUID) return;

    // Add post to Firebase DB
    addCommentToDb({
      commentText: inputText.value,
      authorUUID: userData.userUUID,
      commentId: `${userData.userUUID.slice(0, 8)}-${Math.round(Math.random() * 1000000)}`,
      author: userData.userName,
      replyTo: null,
    });

    clearForm();
  }

  return (
    <div className="create-comment">
      <form>
        <textarea placeholder="Comment Text" rows="5" />
        <button type="button" onClick={onSubmit}>Comment</button>
      </form>
    </div>
  );
}

export default CreateComment;
