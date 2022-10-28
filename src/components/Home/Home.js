import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { UserDataContext } from '../../UserDataContext';
import Post from '../Post/Post';
import './Home.css';

function mergeUsers(usersList) {
  // Merge all users from a list in one object
  const allUserMerge = {};
  for (let index = 0; index < usersList.length; index++) {
    const element = usersList[index];

    allUserMerge[element.userUUID] = element;
  }

  return allUserMerge;
}

function mergePosts(postsList) {
  // Merge all posts from a list in one object
  const allPostMerge = {};
  for (let index = 0; index < postsList.length; index++) {
    const element = postsList[index];
    const postsKeys = Object.keys(element);

    for (let i = 0; i < postsKeys.length; i++) {
      const postId = postsKeys[i];

      allPostMerge[postId] = element[postId];
    }
  }

  return allPostMerge;
}

function Home({
  loadUserData, loadUserFollow, loadUserPost, sortPosts,
}) {
  const { param } = useParams();
  const UserData = useContext(UserDataContext);
  const [homeDbPost, setHomeDbPost] = useState({});
  const [homeDbUser, setHomeDbUser] = useState({});

  // componentDidMount
  useEffect(() => {
    console.log('componentDidMount or update');

    async function dbAllPosts() {
      // Load user follow data's and post's
      const dbData = await loadUserPost('');

      if (dbData === 'No data available') {
        console.log('No data available ');
        console.log(dbData);
      }

      const usersUuid = Object.keys(dbData);

      // For each followed users, load their user data
      const resultsUsers = [];

      for (let index = 0; index < usersUuid.length; index++) {
        const element = usersUuid[index];
        resultsUsers.push(loadUserData(element));
      }

      const allResultsUsers = await Promise.all(resultsUsers);
      const mergedUsersData = mergeUsers(allResultsUsers); // Merge users in one object
      setHomeDbUser(mergedUsersData);

      // Extract post into an array
      const postsArray = [];

      for (let index = 0; index < usersUuid.length; index++) {
        const key = usersUuid[index];
        postsArray.push(dbData[key]);
      }

      const mergedPostsData = mergePosts(postsArray);

      const sortedPost = sortPosts.newest(mergedPostsData); // Sort posts by time
      console.log(sortedPost);
      setHomeDbPost(sortedPost);
    }

    async function dbFollow(uuid) {
      // Load user follow data's and post's
      const dbData = await loadUserFollow(uuid);

      if (dbData === 'No data available') {
        console.log('No data available ');
        return;
      }

      const dbDataKeys = Object.keys(dbData);

      // For each followed users, load their user data
      const resultsUsers = [];

      for (let index = 0; index < dbDataKeys.length; index++) {
        const element = dbDataKeys[index];
        resultsUsers.push(loadUserData(element));
      }

      // resultsUsers.push(loadUserData(uuid)); // To be removed
      const allResultsUsers = await Promise.all(resultsUsers);
      const mergedUsersData = mergeUsers(allResultsUsers); // Merge users in one object
      setHomeDbUser(mergedUsersData);

      // For each followed users, load their posts
      const postResults = [];

      for (let index = 0; index < dbDataKeys.length; index++) {
        const element = dbDataKeys[index];
        postResults.push(loadUserPost(element));
      }

      // postResults.push(loadUserPost(uuid)); // To be removed
      const allResultsPosts = await Promise.all(postResults);
      const mergedPostsData = mergePosts(allResultsPosts);

      const sortedPost = sortPosts.newest(mergedPostsData); // Sort posts by time
      console.log(sortedPost);
      setHomeDbPost(sortedPost);
    }

    // When the page mount...
    // ... if user is logged in
    if (UserData.userUUID) {
      // Load user follow and follow posts
      console.log('Load user follow and followed user post');
      dbFollow(UserData.userUUID);
      return;
    }

    // ... if user is not logged in
    dbAllPosts();
    console.log('user is not logged or disconected, load all posts');

    // componentWillUnmount
    return () => {
      console.log('componentWillUnmount');
    };
  }, [UserData]);

  function isPostExist() {
    if (homeDbPost === 'No data available') {
      return (
        <div> Not post found! </div>
      );
    }

    if (homeDbPost.length > 0) {
      return (
        homeDbPost.map((postId) => (
          <Post
            postData={postId[1]}
            userData={homeDbUser[postId[1].authorUUID]}
            key={postId[0]}
          />
        ))
      );
    }

    return null;
  }

  return (
    <div className="home">
      {isPostExist()}
      <br />
      HOME -
      {' '}
      {param}
      <br />
      UserData:
      {UserData.userUUID}
      <br />
    </div>
  );
}

export default Home;
