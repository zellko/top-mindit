import { initializeApp } from 'firebase/app';
import {
  getDatabase, ref, set, onValue,
} from 'firebase/database';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

console.log('test firebase call 1');

// // Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);

// /** ********************
// Firebase DB
// ********************** */

function testWrite(a, b) {
  set(ref(db, `test/${a}`), {
    testValue: b,
  });
}
function testRead() {
  const testDB = ref(db, 'test/');

  onValue(testDB, (snapshot) => {
    const data = snapshot.val();

    console.log(data);
  });
}

export {
  testWrite, testRead,
};
