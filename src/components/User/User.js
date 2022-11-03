import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { UserDataContext } from '../../UserDataContext';
import UserIntro from './UserIntro/UserIntro';
import CreatePost from '../CreatePost/CreatePost';
import './User.css';
import Post from '../Post/Post';

function User({
  loadUserData, loadUserPost, loadUserList, writePostToDb, sortPosts, addFollow, addLike,
}) {
  const params = useParams();
  const data = useLocation();
  const getContext = useContext(UserDataContext);
  const { userData, userFollow } = getContext;
  const [userDbPost, setUserDbPost] = useState({});
  const [userDbData, setUserDbData] = useState({});

  // componentDidUpdate
  useEffect(() => {
    async function dbUserPost(uuid) {
      const dbData = await loadUserPost(uuid);

      if (dbData !== 'No data available') {
        const sortedPost = sortPosts.newest(dbData);
        setUserDbPost(sortedPost);
        return;
      }

      setUserDbPost(dbData);
    }

    async function dbUserData(uuid) {
      const dbData = await loadUserData(uuid);
      setUserDbData(dbData);
    }

    async function isUserInDb() {
      // load User list
      const dbData = await loadUserList();

      const dbDataKeys = Object.keys(dbData);
      // For each users, check if there is an user with provided name ...
      for (let index = 0; index < dbDataKeys.length; index++) {
        const element = dbData[dbDataKeys[index]];
        if (element === params.id) {
          /// .. if it's in DB, fetch userData and userPosts
          const userUUID = dbDataKeys[index];
          dbUserData(userUUID);
          dbUserPost(userUUID);
          return;
        }
      }

      // .. else, show message ("Sorry, nobody on MindIt goes by that name.")
      console.log('User not found');
    }

    // Check if an UUID is provided...
    if (data.state) {
      // ..if yes, load User data with provided uuid
      // .. and load Posts
      dbUserData(data.state.userUUID);
      dbUserPost(data.state.userUUID);
      return;
    }

    // Else, check if a params is provided...
    if (params) {
      // ..if yes, check if params is corresponding to an user name in the database
      isUserInDb();
    }

    // componentWillUnmount
    return () => {
      console.log('componentWillUnmount');
    };
  }, [params, data]);

  function isUserExist() {
    if (userDbData.userName) {
      return (
        <UserIntro
          userIntroCardData={userDbData}
          editProfile={() => {
            console.log('ToDo: Edit profile');
          }}
          addUserToFollowed={(followData) => {
            addFollow(userData.userUUID, followData, 'following');
          }}

        />
      );
    }

    return (
      <div className="nf-user">
        <p>Sorry, nobody on MindIt goes by that name.</p>
        <button type="button">
          <Link to="/">
            GO HOME
          </Link>
        </button>
      </div>
    );
  }

  function isPostExist() {
    if (userDbPost === 'No data available') {
      return (
        <div> This user did not posted anything yet! </div>
      );
    }

    if (userDbPost.length > 0) {
      return (
        userDbPost.map((postId) => (
          <Post
            postData={postId[1]}
            authorData={userDbData}
            key={postId[0]}
            handlePostLike={() => {
              addLike(postId[0], postId[1].authorUUID);
            }}
          />
        ))
      );
    }

    return null;
  }

  function isUserLogged() {
    if (userData.userUUID === userDbData.userUUID) {
      return (
        <CreatePost
          addPostToDb={(postData) => {
            writePostToDb(postData);
          }}
        />
      );
    }
  }

  return (
    <div className="User">
      {isUserExist()}
      {isUserLogged()}
      {isPostExist()}
    </div>
  );
}

export default User;
