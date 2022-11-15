import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../../../UserDataContext';
import './UserEditForm.css';

function UserEditForm({ updateProfile }) {
  const [postTopic, setPostTopic] = useState([]);
  const getContext = useContext(UserDataContext);
  const { userData, userFollow } = getContext;

  useEffect(() => {
    const inputName = document.querySelector('.edit-profile #input-name');
    const inputBio = document.querySelector('.edit-profile textarea');
    inputName.value = userData.userName;
    inputBio.value = userData.userBio;
    setPostTopic(userData.userTopic);
  }, []);

  function addTopic() {
    const inputTopic = document.querySelector('.edit-profile #input-tag');

    if (!inputTopic) return;
    const topicArray = [...postTopic];

    if (inputTopic.value === '') return;
    if (topicArray.includes(inputTopic.value)) return;
    if (topicArray.length > 2) return;

    topicArray.push(inputTopic.value);
    setPostTopic(topicArray);
  }

  function removeTopic(e) {
    const value = e.target.textContent;
    const topicArray = [...postTopic];

    const updatedArray = topicArray.filter((topic) => {
      if (topic !== value) { return topic; }
    });

    setPostTopic(updatedArray);
  }

  function onCloseForm() {
    // Clear form value
    const inputName = document.querySelector('.edit-profile #input-name');
    const inputBio = document.querySelector('.edit-profile textarea');
    const inputTopic = document.querySelector('.edit-profile  #input-tag');
    const inputProfilePic = document.querySelector('.edit-profile  #input-pic');
    const inputBanner = document.querySelector('.edit-profile  #input-banner');

    inputName.value = userData.userName;
    inputBio.value = userData.userBio;
    inputTopic.value = '';
    inputProfilePic.value = '';
    inputBanner.value = '';

    setPostTopic(userData.userTopic);

    // Hide form
    const form = document.querySelector('.edit-profile');
    if (form) {
      form.classList.add('hidden');
    }
  }

  function onSave() {
    const inputName = document.querySelector('.edit-profile #input-name');
    const inputBio = document.querySelector('.edit-profile textarea');
    const inputProfilePic = document.querySelector('.edit-profile  #input-pic');
    const inputBanner = document.querySelector('.edit-profile  #input-banner');
    const formError = document.querySelector('.edit-profile .form-error');

    if (inputProfilePic.files[0] !== undefined) {
      // Check if the inputProfilePic is an image of max 5mb.
      if (!inputProfilePic.files[0].type.match('image.*') || (inputProfilePic.files[0].size > 5242880)) {
        formError.textContent = 'Uploaded file is not an image or size >5mb';
        return;
      }
    }

    if (inputBanner.files[0] !== undefined) {
    // Check if the inputBanner is an image  of max 5mb.
      if (!inputBanner.files[0].type.match('image.*') || (inputBanner.files[0].size > 5242880)) {
        formError.textContent = 'Uploaded file is not an image or size >5mb';
        return;
      }
    }

    if (inputName.value === '' || inputBio.value === '' || postTopic.length === 0) {
      formError.textContent = 'Please fill up all fields and add minimum on topic';
      return;
    }

    updateProfile(inputName.value, inputBio.value, postTopic, inputProfilePic, inputBanner);
    onCloseForm();
  }

  return (
    <div className="edit-profile hidden">
      <form>
        <div className="form-control">
          <button type="button" onClick={onSave}>Save</button>
          <button type="button" onClick={onCloseForm}>✕ Close</button>
        </div>
        <label htmlFor="input-banner">
          Banner:
          {' '}
          <span>max. 5mb</span>
        </label>
        <input type="file" id="input-banner" />
        <label htmlFor="input-pic">
          Profile picture:
          {' '}
          <span>max. 5mb</span>
        </label>
        <input type="file" id="input-pic" />
        <label htmlFor="input-name">New Name</label>
        <input type="text" id="input-name" />
        <label htmlFor="input-bio">Bio</label>
        <textarea id="input-bio" rows="5" />
        <div className="tag-container">
          {
              postTopic.map((topic) => (
                <button type="button" onClick={removeTopic} key={`${topic}-${Math.random()}`}>
                  {topic}
                </button>
              ))
          }
          <input id="input-tag" placeholder="Topic (Min 1 / Max 3)" />
          <button type="button" onClick={addTopic}>Add</button>
        </div>
      </form>
      <span className="form-error" />
    </div>
  );
}

export default UserEditForm;
