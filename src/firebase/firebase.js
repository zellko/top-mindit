import { initializeApp } from 'firebase/app';
import {
  getDatabase, ref, update, get,
} from 'firebase/database';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// /** ********************
// Firebase Realtime Database
// ********************** */

function readDb(dbName, id) {
  return new Promise((resolve, reject) => {
    const postsDb = ref(db, `${dbName}/${id}`);

    get(postsDb)
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

    if (postIdArray.includes(`${postId}`)) {
      const updates = {};
      updates[`/posts/${authorUUID}/${postId}`] = data;
      updates[`/posts/${authorUUID}/${postId}`].postTimestamp = dbData[postId].postTimestamp; // Keep timestamp

      return update(ref(db), updates);
    }

    console.log('Error: post not found');
    return 'Error: post not found';
  };

  const updateComment = async (data) => {
    // Get post ID / user uuid
    const { postId, commentId } = data;

    // Fetch data from DB
    const dbData = await readDb('comments', postId);

    if (typeof (dbData) !== 'object') {
      console.log('Error: Comment not found');
      return 'Error: Comment not found';
    }

    if (dbData[commentId].commentId === commentId) {
      const updates = {};
      updates[`/comments/${postId}/${commentId}`] = data;
      updates[`/comments/${postId}/${commentId}`].commentTimestamp = dbData[commentId].commentTimestamp; // Keep timestamp

      console.log(updates);
      return update(ref(db), updates);
    }

    console.log('Error: Comment not found');
    return 'Error: Comment not found';
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

    const isFollowInDb = dbDataKey.includes(follow[0]);

    if (isFollowInDb) {
      // If db include the follow UUID, remove it from DB.
      updates[`/${type}/${uuid}/`] = dbData;
      delete dbData[key];

      return update(ref(db), updates);
    }

    // Else, add it to DB
    dbData[key] = follow[1];
    updates[`/${type}/${uuid}/`] = dbData;
    return update(ref(db), updates);
  };

  return {
    updatePost, updateComment, updateFollow,
  };
})();

// /** ********************
// Firebase Authentication
// ********************** */

export {
  readDb, writeDb, updateDb,
};
