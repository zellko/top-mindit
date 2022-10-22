import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { UserDataContext } from '../../UserDataContext';
import UserIntro from './UserIntro/UserIntro';
import CreatePost from '../CreatePost/CreatePost';
import './User.css';

function User({
  loadUserData, loadUserPost, loadUserList, writePostToDb,
}) {
  const params = useParams();
  const data = useLocation();
  const UserData = useContext(UserDataContext);
  const [userDbPost, setUserDbPost] = useState({});
  const [userDbData, setUserDbData] = useState({});

  useEffect(() => {
    async function dbUserPost(uuid) {
      const dbData = await loadUserPost(uuid);
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
          data={userDbData}
          editProfile={() => {
            console.log('ToDo: Edit profile');
          }}
          addUserToFollowed={() => {
            console.log('ToDo: addUserToFollowed');
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
    // ToDo
    return null;
  }

  function isUserLogged() {
    if (UserData.userUUID === userDbData.userUUID) {
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
