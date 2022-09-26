import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import User from './components/User/User';
import './App.css';
import {
  readDb, writeDb, updateDb, signIn, signOutUser, isUserLoggedIn,
} from './firebase/firebase';

// TODO: ON APP LOADING, CHECK IF USER IS LOGGED

const mockUserFollow = {
  uuid123xyz: 'test Name',
  uuid321zyx: 'test Name2',
};

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

  async function isUserInDb(data, uuid) {
    const formatedData = formatFirebaseUserData(data);

    const userDbData = await readDb('users', uuid);

    if (typeof (userDbData) === 'object') {
      // If readDB return an object, user is found in database...
      console.log('yes user is in DB');
      setUserData(userDbData); // Set userData state with DB data
    }

    // Else, if user is not in DB...
    writeDb.writeUser(formatedData); // ... Add user to DB

    setUserData(formatedData); // Set userData state with formated Data
    // TBD: Check in case of error ?
  }

  async function onLogIn() {
    const userAuthData = await signIn();
    // const userAuthData = 'error';

    // If user is sign In without error
    if (userAuthData.uid) {
      console.log(userAuthData.uid);

      // Check if user is in database
      await isUserInDb(userAuthData, userAuthData.uid);

      // Fetch logged user followed users
      const userFollowed = await readDb('following', userAuthData.uid);

      if (typeof (userFollowed) === 'object') {
        // If readDB return an object, users followed is found in database...
        setUserFollow(userFollowed); // Set userData state with DB data
      }
    }

    // else, if there is an error... TBD
  }

  async function onLogOut() {
    const isSignedOut = await signOutUser();
    // const isSignedOut = 'test';

    // If user is sign out without error
    if (isSignedOut) {
      // Show modal, Signed out
      console.log(isSignedOut);

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
        await isUserInDb(userAuthData, userAuthData.uid);

        // Fetch logged user followed users
        const userFollowed = await readDb('following', userAuthData.uid);

        if (typeof (userFollowed) === 'object') {
        // If readDB return an object, users followed is found in database...
          setUserFollow(userFollowed); // Set userData state with DB data
        }
      }
    }

    checkIsUserLoggedIn();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header
          userData={userData}
          userFollow={userFollow}
          onLogInClick={logInCallback}
          onLogOutClick={logOutCallback}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/All/:param" element={<Home />} />
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
