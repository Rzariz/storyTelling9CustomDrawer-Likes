// import firebase from 'firebase'
// import 'firebase/app'
// import 'firebase/auth'
// require("firebase/auth")
// require("firebase/app")


// export const firebaseConfig = {
//   apiKey: "AIzaSyCQiwaAL1vPMNkc4iWvFofPqDDBRM6dgwo",
//   authDomain: "storytellingapp-cf9aa.firebaseapp.com",
//   databaseURL: "https://storytellingapp-cf9aa-default-rtdb.firebaseio.com",
//   projectId: "storytellingapp-cf9aa",
//   storageBucket: "storytellingapp-cf9aa.appspot.com",
//   messagingSenderId: "416347912515",
//   appId: "1:416347912515:web:29d2a6e19e5bec0e9857f6"
// };


// //export default firebase.database();

import firebase from 'firebase';
import 'firebase/app';
import 'firebase/auth';
require('firebase/auth');
require('firebase/app');
var firebaseConfig = {
  apiKey: 'AIzaSyCQiwaAL1vPMNkc4iWvFofPqDDBRM6dgwo',
  authDomain: 'storytellingapp-cf9aa.firebaseapp.com',
  databaseURL: 'https://storytellingapp-cf9aa-default-rtdb.firebaseio.com',
  projectId: 'storytellingapp-cf9aa',
  storageBucket: 'storytellingapp-cf9aa.appspot.com',
  messagingSenderId: '416347912515',
  appId: '1:416347912515:web:29d2a6e19e5bec0e9857f6',
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase.database();
