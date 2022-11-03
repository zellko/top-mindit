import { initializeApp } from 'firebase/app';
import {
  getDatabase, ref, update, get,
} from 'firebase/database';
import {
  getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged,
} from 'firebase/auth';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// Initialize provider for Google authentication
const provider = new GoogleAuthProvider();

// /** ********************
// Firebase Realtime Database
// ********************** */

function readDb(dbName, id) {
  return new Promise((resolve, reject) => {
    const dbRef = ref(db, `${dbName}/${id}`);

    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          resolve(data); // fulfilled
        }
        resolve('No data available'); // rejected
      }).catch((error) => {
        console.error(error);
        reject(`rejected: ${error}`); // rejected
      });
  });
}

const writeDb = (() => {
  const writeUser = (data) => {
    const { userUUID } = data; // Get user ID number (UUID)

    const updates = {};
    updates[`/users/${userUUID}`] = data;

    return update(ref(db), updates);
  };

  const writePost = (data) => {
    // Get timestamp and add it to post data
    const dbData = { ...data };
    const timestamp = Date.now();
    dbData.postTimestamp = timestamp;

    // Get post ID / user uuid
    const { postId, authorUUID } = dbData;

    // Then, add data to the database
    const updates = {};
    updates[`/posts/${authorUUID}/${postId}`] = dbData;

    return update(ref(db), updates);
  };

  const writeComment = (data) => {
    // Get timestamp and add it to post data
    const dbData = { ...data };
    const timestamp = Date.now();
    dbData.postTimestamp = timestamp;

    // Get post ID / comment ID
    const { postId } = data;
    const { commentId } = data;

    // Then, add data to the database
    const updates = {};
    updates[`/comments/${postId}/${commentId}`] = data;

    return update(ref(db), updates);
  };

  const writeTopicPost = async (data) => {
    // Get post ID
    const postId = Object.keys(data)[0];

    // Then, we add new post to the database, at the end of the DB
    const updates = {};
    updates[`/topicPost/${postId}`] = data[postId];

    return update(ref(db), updates);
  };

  return {
    writeUser, writePost, writeComment, writeTopicPost,
  };
})();

const updateDb = (() => {
  const updatePost = async (data) => {
    // Get post ID / user uuid
    const { postId, authorUUID } = data;

    // Fetch data from DB
    const dbData = await readDb('posts', authorUUID);

    // Check that DB is containing a post with corresponding to postId
    const postIdArray = Object.keys(dbData);

    // ------> TBD Should I add String(postId)?????????
    if (postIdArray.includes(`${postId}`)) {
      const updates = {};
      updates[`/posts/${authorUUID}/${postId}`] = data;
      updates[`/posts/${authorUUID}/${postId}`].postTimestamp = dbData[postId].postTimestamp; // Keep timestamp

      return update(ref(db), updates);
    }

    console.log('Error: post not found');
    return 'Error: post not found';
  };

  const updateComment = async (postId, authorUUID, data) => {
    // // Fetch data from DB
    const dbData = await readDb(`posts/${authorUUID}/${postId}`, 'comments');
    const updates = {};

    // Get Timestamp and add it to data
    const timestamp = Date.now();
    const commentData = data;
    commentData.timestamp = timestamp;

    if (dbData === 'No data available') {
      updates[`/posts/${authorUUID}/${postId}/comments`] = [commentData];
      return update(ref(db), updates);
    }

    const dbDataCopy = [...dbData];
    dbDataCopy.push(commentData);
    updates[`/posts/${authorUUID}/${postId}/comments`] = dbDataCopy;

    return update(ref(db), updates);
  };

  const updateFollow = async (uuid, follow, type) => {
    // Fetch data from DB
    const dbData = await readDb(type, uuid);
    const dbDataKey = Object.keys(dbData);
    const updates = {};
    const key = follow[0];

    if (dbData === 'No data available') {
      updates[`/${type}/${uuid}/`] = { [key]: follow[1] };

      return update(ref(db), updates);
    }

    const isFollowInDb = dbDataKey.includes(String(follow[0]));

    if (isFollowInDb) {
      // If db include the follow UUID, remove it from DB.
      updates[`/${type}/${uuid}/`] = dbData;
      delete dbData[key];

      return update(ref(db), updates);
    }

    // Else, add it to DBlikeArray
    dbData[key] = follow[1];
    updates[`/${type}/${uuid}/`] = dbData;
    return update(ref(db), updates);
  };

  const updateUsersList = async (data) => {
    // Get post ID / user uuid
    const { userUUID, userName } = data;

    // Fetch data from DB
    const dbData = await readDb('usersList', '');
    dbData[userUUID] = userName;
    // Update Users list database
    const updates = {};
    updates['/usersList'] = dbData;

    return update(ref(db), updates);
  };

  const updateLike = async (postId, authorUUID, userUUID) => {
    // Fetch data from DB
    const dbData = await readDb(`posts/${authorUUID}/${postId}`, 'like');
    const updates = {};

    // Check that DB is containing a post with corresponding to postId
    if (dbData.includes(String(userUUID))) {
      console.log('Post already liked by this user');

      // If yes, remove it from DB.
      const dbDataCopy = [...dbData];
      const indexUserUUID = dbDataCopy.indexOf(userUUID);
      dbDataCopy.splice(indexUserUUID, 1);
      updates[`/posts/${authorUUID}/${postId}/like`] = dbDataCopy;
      return update(ref(db), updates);
    }

    if (dbData === 'No data available') {
      updates[`/posts/${authorUUID}/${postId}/like`] = [userUUID];
      return update(ref(db), updates);
    }

    const dbDataCopy = [...dbData];
    dbDataCopy.push(userUUID);

    updates[`/posts/${authorUUID}/${postId}/like`] = dbDataCopy;
    return update(ref(db), updates);
  };

  return {
    updatePost, updateComment, updateFollow, updateUsersList, updateLike,
  };
})();

// /** ********************
// Firebase Authentication
// ********************** */

const auth = getAuth();

function signIn() {
  return new Promise((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const { user } = result;
        resolve(user); // fulfilled
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(`Sign-in error: ${errorCode}-${errorMessage}`);
        reject('error'); // rejected
      });
  });
}

function signOutUser() {
  return new Promise((resolve, reject) => {
    signOut(auth).then(() => {
      // Sign-out successful.
      resolve(true); // fulfilled
    }).catch((error) => {
      // An error happened.

      console.log(`Sign-out error: ${error}`);
      reject('Sign-out error'); // rejected
    });
  });
}

function isUserLoggedIn() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        resolve(user); // fulfilled
      }
      // User is signed out
      resolve(false); // fulfilled
    });
  });
}

export {
  readDb, writeDb, updateDb, signIn, signOutUser, isUserLoggedIn,
};
