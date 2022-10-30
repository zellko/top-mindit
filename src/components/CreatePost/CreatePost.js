import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import { UserDataContext } from '../../UserDataContext';
import './CreatePost.css';

function CreatePost({ addPostToDb }) {
  const getContext = useContext(UserDataContext);
  const { userData, userFollow } = getContext;
  const [postTopic, setPostTopic] = useState([]);
  const refAddTopic = useRef(null);
  const refClose = useRef(null);

  // componentDidMount
  useEffect(() => {
    const inputTitle = document.querySelector('.create-post .input-title');
    const divTextarea = document.querySelector('.create-post form > :last-child');

    inputTitle.addEventListener('focusin', () => {
      inputTitle.placeholder = 'Post Title';
      divTextarea.classList.add('show-create-post');
    });

    const handleAddTopic = () => {
      const inputTopic = document.querySelector('.create-post .input-topic');
      const topicArray = [...postTopic];

      if (inputTopic.value === '') return;
      if (topicArray.includes(inputTopic.value)) return;
      if (topicArray.length > 2) return;

      topicArray.push(inputTopic.value);
      setPostTopic(topicArray);
    };

    const handleClose = () => {
      // const inputText = document.querySelector('.create-post textarea');
      // const inputTopic = document.querySelector('.create-post .input-topic');
      // Clear form value
      // inputTitle.value = '';
      // inputText.value = '';
      // inputTopic.value = '';
      setPostTopic([]);

      // Hide fields
      divTextarea.classList.remove('show-create-post');
    };

    const btnAddTopic = refAddTopic.current;
    const btnClose = refClose.current;

    btnAddTopic.addEventListener('click', handleAddTopic);
    btnClose.addEventListener('click', handleClose);

    // componentWillUnmount
    return () => {
      inputTitle.removeEventListener('focus', () => {});
      btnAddTopic.removeEventListener('click', handleAddTopic);
      btnClose.removeEventListener('click', handleClose);
    };
  }, [postTopic]);

  function clearForm() {
    const inputTitle = document.querySelector('.create-post .input-title');
    const divTextarea = document.querySelector('.create-post form > :last-child');
    const inputText = document.querySelector('.create-post textarea');
    const inputTopic = document.querySelector('.create-post .input-topic');

    // Clear form value
    inputTitle.value = '';
    inputText.value = '';
    inputTopic.value = '';

    // Hide fields
    divTextarea.classList.remove('show-create-post');

    // Reset postTopic state
    setPostTopic([]);
  }

  function onSubmit() {
    const postTitle = document.querySelector('.create-post .input-title');
    const postContent = document.querySelector('.create-post textarea');

    // Check if title and post content are filled...
    // ... minimum 1 topic is added, maximum 3
    // ... user is logged
    if (postTitle.value.length === 0 || postContent.value.length === 0) return;
    if (postTopic.length < 1 || postTopic.length > 3) return;
    if (!userData.userUUID) return;

    // Add post to Firebase DB
    addPostToDb({
      title: postTitle.value,
      content: postContent.value,
      authorUUID: userData.userUUID,
      author: userData.userName,
      topics: postTopic,
      postId: `${userData.userUUID.slice(0, 8)}-${Math.round(Math.random() * 1000000)}`,
    });

    clearForm();
    // Refresh page
    // window.location.reload(false);
  }

  function removeTopic(e) {
    const value = e.target.textContent;
    const topicArray = [...postTopic];

    const updatedArray = topicArray.filter((topic) => {
      if (topic !== value) { return topic; }
    });

    setPostTopic(updatedArray);
  }

  return (
    <div className="create-post">
      <form>
        <div>
          {/* <img src={`${userData.userprofilePicture}?sz=150`} referrerPolicy="no-referrer" alt="User profile" /> */}
          <input className="input-title" placeholder="Create Post" />
        </div>

        <div className="form-extend">
          <div className="add-tag-container">
            <input className="input-topic" placeholder="Topic (Min 1 / Max 3)" />
            <button type="button" ref={refAddTopic}>Add</button>
          </div>
          <div className="tag-container">
            {
              postTopic.map((topic) => (
                <button type="button" onClick={removeTopic} key={`${topic}-${Math.random()}`}>
                  {topic}
                </button>
              ))
          }
          </div>
          <textarea placeholder="Post Text" rows="5" />
          <button type="button" onClick={onSubmit}>Submit</button>
          <div className="form-extend-close" ref={refClose}>▲</div>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
