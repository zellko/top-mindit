import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../../../UserDataContext';
import './UserEditForm.css';
import imgAddIcon from '../../../img/image-plus.png';

function UserEditForm({ updateProfile }) {
  const [postTopic, setPostTopic] = useState([]);
  const getContext = useContext(UserDataContext);
  const { userData, userFollow } = getContext;

  useEffect(() => {
    const inputName = document.querySelector('.edit-profile #input-name');
    const inputBio = document.querySelector('.edit-profile textarea');
    const inputBanner = document.querySelector('.edit-profile #input-banner');
    const inputPic = document.querySelector('.edit-profile #input-pic');
    const inputBannerSpan = document.querySelector('.edit-profile .input-banner-container span');
    const inputPicSpan = document.querySelector('.edit-profile .input-pic-container span');
    inputName.value = userData.userName;
    inputBio.value = userData.userBio;
    setPostTopic(userData.userTopic);

    inputBanner.addEventListener('change', (e) => {
      const fileName = e.target.files[0].name;
      // if (inputBannerSpan === null) return;
      inputBannerSpan.textContent = fileName;
    });

    inputPic.addEventListener('change', (e) => {
      const fileName = e.target.files[0].name;
      inputPicSpan.textContent = fileName;
    });

    // componentWillUnmount
    return () => {
      inputBanner.removeEventListener('change', () => {});
      inputPic.removeEventListener('change', () => {});
    };
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
    const inputBannerSpan = document.querySelector('.edit-profile .input-banner-container span');
    const inputPicSpan = document.querySelector('.edit-profile .input-pic-container span');

    inputName.value = userData.userName;
    inputBio.value = userData.userBio;
    inputTopic.value = '';
    inputProfilePic.value = '';
    inputBanner.value = '';
    inputBannerSpan.textContent = '';
    inputPicSpan.textContent = '';

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
        <div className="input-banner-container">
          <div className="custom-input-banner">
            <label htmlFor="input-banner">
              <img src={imgAddIcon} alt="Add banner" />
              Add Banner
            </label>
            <input type="file" id="input-banner" />
          </div>
          <span />
        </div>
        <div className="input-pic-container">
          <div className="custom-input-pic">
            <label htmlFor="input-pic">
              <img src={imgAddIcon} alt="Add banner" />
              Add Profile Picture
            </label>
            <input type="file" id="input-pic" />
          </div>
          <span />
        </div>
        <span>max. 5mb</span>
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
        <span className="form-error" />
      </form>
    </div>
  );
}

export default UserEditForm;
