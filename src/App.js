import React, {
  useState, useEffect, useCallback, useMemo,
  useContext,
} from 'react';
import {
  Routes, Route, useNavigate, useLocation,
} from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import User from './components/User/User';
import Comments from './components/Comments/Comments';
import './App.css';
import {
  readDb, writeDb, updateDb, signIn, signOutUser, isUserLoggedIn, deleteDbData,
} from './firebase/firebase';
import { UserDataContext } from './UserDataContext';

const sortPosts = (() => {
  const newest = (postsList) => {
    let postsEntries;

    if (Array.isArray(postsList)) {
      postsEntries = postsList;
    } else {
      postsEntries = Object.entries(postsList);
    }

    const sortedPosts = postsEntries.sort((a, b) => b[1].postTimestamp - a[1].postTimestamp);
    return sortedPosts;
  };
  const oldest = (postsList) => {
    let postsEntries;

    if (Array.isArray(postsList)) {
      postsEntries = postsList;
    } else {
      postsEntries = Object.entries(postsList);
    }

    const sortedPosts = postsEntries.sort((a, b) => a[1].postTimestamp - b[1].postTimestamp);
    return sortedPosts;
  };

  return { newest, oldest };
})();

function formatFirebaseUserData(googleData) {
  const data = {};
  // Return user data as an object
  data.userName = googleData.displayName;
  data.userUUID = googleData.uid;
  data.userBio = 'No Bio yet.';
  data.userprofilePicture = googleData.photoURL;
  data.userTopic = ['New User'];
  data.isFirstLogin = true;
  return data;
}

function App() {
  const [userData, setUserData] = useState({});
  const [userFollow, setUserFollow] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [dbUpdate, setDbUpdate] = useState(0);

  /*
  async function isUserInDb(data, uuid) {
    const formattedData = formatFirebaseUserData(data);

    const userDbData = await readDb('users', uuid);

    if (typeof (userDbData) === 'object') {
      // If readDB return an object, user is found in database...
      console.log('yes user is in DB');
      setUserData(userDbData); // Set userData state with DB data

      return;
    }

    // Else, if user is not in DB...
    writeDb.writeUser(formattedData); // ... Add user to DB
    updateDb.updateUsersList(formattedData);

    setUserData(formattedData); // Set userData state with formatted Data

    // ... At first login, user are redirected to their user page (to modify their profile)
    navigate(`/user/${formattedData.userName}`, { state: { ...formattedData } });

    // TBD: Check in case of error ?
  } */

  async function onLogIn() {
    // const userAuthData = await signIn();
    let userAuthData;
    try {
      userAuthData = await signIn();
    } catch (error) {
      console.log('Login Error');
      return;
    }

    // If user is sign In without error
    if (userAuthData.uid) {
      // Check if user is in database
      // await isUserInDb(userAuthData, userAuthData.uid);

      const userDbData = await readDb('users', userAuthData.uid);
      if (typeof (userDbData) === 'object') {
        // If readDB return an object, user is found in database...
        console.log('yes user is in DB');
        setUserData(userDbData); // Set userData state with DB data
      } else {
        const formattedData = formatFirebaseUserData(userAuthData);
        writeDb.writeUser(formattedData); // ... Add user to DB
        updateDb.updateUsersList(formattedData);

        setUserData(formattedData); // Set userData state with formatted Data

        // ... At first login, user are redirected to their user page (to modify their profile)
        navigate(`/user/${formattedData.userName}`, { state: { ...formattedData } });
      }

      // Fetch logged user followed users
      const userFollowed = await readDb('following', userAuthData.uid);

      if (typeof (userFollowed) === 'object') {
        // If readDB return an object, users followed is found in database...
        setUserFollow(userFollowed); // Set userData state with DB data

        /** DEV_TBD if bellow redirect should be kept or not * */
        const currentLocation = location.pathname;
        if (currentLocation === '/all/posts' || currentLocation === '/all/users') navigate('/');
        // return
      }
    }

    // else, if there is an error... TBD
  }

  async function onLogOut() {
    const isSignedOut = await signOutUser();

    // If user is sign out without error
    if (isSignedOut) {
      setUserData({});
    }

    // else, if there is an error
    console.log(isSignedOut);
  }

  const logInCallback = useCallback(() => onLogIn());
  const logOutCallback = useCallback(() => onLogOut());

  // componentDidMount
  useEffect(() => {
    // On page loading, check if user is already logged in
    async function checkIsUserLoggedIn() {
      // Check for user data using isUserLoggedIn (onAuthStateChanged method from firebase)
      const userAuthData = await isUserLoggedIn();

      if (userAuthData) {
        // If user is already logged...
        console.log('user is logged in!');

        // ... check if user is in database
        // await isUserInDb(userAuthData, userAuthData.uid);
        const userDbData = await readDb('users', userAuthData.uid);
        if (typeof (userDbData) === 'object') {
          // If readDB return an object, user is found in database...
          console.log('yes user is in DB');
          setUserData(userDbData); // Set userData state with DB data
        } else {
          const formattedData = formatFirebaseUserData(userAuthData);
          writeDb.writeUser(formattedData); // ... Add user to DB
          updateDb.updateUsersList(formattedData);
          setUserData(formattedData); // Set userData state with formatted Data

          // ... At first login, user are redirected to their user page (to modify their profile)
          navigate(`/user/${formattedData.userName}`, { state: { ...formattedData } });
        }

        // Fetch logged user followed users
        const userFollowed = await readDb('following', userAuthData.uid);
        if (typeof (userFollowed) === 'object') {
        // If readDB return an object, users followed is found in database...
          setUserFollow(userFollowed); // Set userData state with DB data
        } else {
          setUserFollow({}); // Set userData state with DB data
        }
      }
    }

    checkIsUserLoggedIn();
  }, [dbUpdate]);

  const userDataMemo = useMemo(() => ({ userData, userFollow }), [userData, userFollow]);

  return (
    <UserDataContext.Provider value={userDataMemo}>
      <div className="App">

        <Header
          userData={userData}
          userFollow={userFollow}
          pathname={location.pathname}
          onLogInClick={logInCallback}
          onLogOutClick={logOutCallback}
        />

        <Routes>
          <Route
            path="/"
            element={(
              <Home
                loadUserData={async (uuid) => {
                  const dbData = await readDb('users', uuid);
                  return dbData;
                }}
                loadUserFollow={async (uuid) => {
                  const dbData = await readDb('following', uuid);
                  return dbData;
                }}
                loadUserPost={async (uuid) => {
                  const dbData = await readDb('posts', uuid);
                  return dbData;
                }}
                sortPosts={sortPosts}
                addLike={(postid, authorUUID) => {
                  updateDb.updateLike(postid, authorUUID, userData.userUUID);
                  // Refresh state in order to "refresh" page so the new post created appear
                  const n = dbUpdate;
                  setDbUpdate(n + 1);
                }}
                deleteData={
                  async (path, id) => {
                    deleteDbData(path, id);
                    // Refresh state in order to "refresh" page so the new post created appear
                    const n = dbUpdate;
                    setDbUpdate(n + 1);
                  }
                }
              />
)}
          />
          <Route
            path="/All/:param"
            element={(
              <Home
                loadUserData={async (uuid) => {
                  const dbData = await readDb('users', uuid);
                  return dbData;
                }}
                loadUserFollow={async (uuid) => {
                  const dbData = await readDb('following', uuid);
                  return dbData;
                }}
                loadUserPost={async (uuid) => {
                  const dbData = await readDb('posts', uuid);
                  return dbData;
                }}
                sortPosts={sortPosts}
                userFollow={userFollow}
                addFollow={(uuid, data, dbName) => {
                  updateDb.updateFollow(uuid, data, dbName);
                  // Refresh state in order to "refresh" page so the new post created appear
                  const n = dbUpdate;
                  setDbUpdate(n + 1);
                }}
                addLike={(postid, authorUUID) => {
                  updateDb.updateLike(postid, authorUUID, userData.userUUID);
                  // Refresh state in order to "refresh" page so the new post created appear
                  const n = dbUpdate;
                  setDbUpdate(n + 1);
                }}
                deleteData={
                  async (path, id) => {
                    deleteDbData(path, id);
                    // Refresh state in order to "refresh" page so the new post created appear
                    const n = dbUpdate;
                    setDbUpdate(n + 1);
                  }
                }
              />
)}
          />
          <Route
            path="/user/:id"
            element={(
              <User
                loadUserData={async (uuid) => {
                  const dbData = await readDb('users', uuid);
                  return dbData;
                }}
                loadUserPost={async (uuid) => {
                  const dbData = await readDb('posts', uuid);
                  return dbData;
                }}
                loadUserList={async () => {
                  const dbData = await readDb('usersList', '');
                  return dbData;
                }}
                writePostToDb={(data) => {
                  writeDb.writePost(data);
                  // Refresh state in order to "refresh" page so the new post created appear
                  const n = dbUpdate;
                  setDbUpdate(n + 1);
                }}
                sortPosts={sortPosts}
                addFollow={(uuid, followData, dbName) => {
                  updateDb.updateFollow(uuid, followData, dbName);
                  // Refresh state in order to "refresh" page so the new post created appear
                  const n = dbUpdate;
                  setDbUpdate(n + 1);
                }}
                addLike={(postid, authorUUID) => {
                  updateDb.updateLike(postid, authorUUID, userData.userUUID);
                  // Refresh state in order to "refresh" page so the new post created appear
                  const n = dbUpdate;
                  setDbUpdate(n + 1);
                }}
                deleteData={
                  async (path, id) => {
                    deleteDbData(path, id);
                    // Refresh state in order to "refresh" page so the new post created appear
                    const n = dbUpdate;
                    setDbUpdate(n + 1);
                  }
                }
              />
)}
          />

          <Route
            path="/comments/:postid"
            element={(
              <Comments
                writeCommentToDb={(postId, authorUUID, commentData) => {
                  updateDb.updateComment(postId, authorUUID, commentData);

                  // Refresh state in order to "refresh" page so the new post created appear
                  const n = dbUpdate;
                  setDbUpdate(n + 1);
                }}
                writeLikeToDb={(postid, authorUUID, commentId) => {
                  updateDb.updateCommentLike(postid, authorUUID, userData.userUUID, commentId);
                  // Refresh state in order to "refresh" page so the new post created appear
                  const n = dbUpdate;
                  setDbUpdate(n + 1);
                }}
                writePostLikeToDb={(postid, authorUUID) => {
                  updateDb.updateLike(postid, authorUUID, userData.userUUID);
                  // Refresh state in order to "refresh" page so the new post created appear
                  const n = dbUpdate;
                  setDbUpdate(n + 1);
                }}
                loadUserData={async (uuid) => {
                  const dbData = await readDb('users', uuid);
                  return dbData;
                }}
                loadAllPost={async () => {
                  const dbData = await readDb('posts', '');
                  return dbData;
                }}
                deleteData={
                  async (path, id) => {
                    deleteDbData(path, id);
                    // Refresh state in order to "refresh" page so the new post created appear
                    const n = dbUpdate;
                    setDbUpdate(n + 1);
                  }
                }
              />
)}
          />
        </Routes>
      </div>
    </UserDataContext.Provider>
  );
}

export default App;
