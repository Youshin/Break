var firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
var firebaseDatabase; //파이어베이스 db 모듈 전역변수
//파이어 베이스 초기화 코드
var config = {
  apiKey: "AIzaSyA9oNOMkppw2zOBFItjcVvyZ--f1onvaOY",
  authDomain: "thanksmemo-19012.firebaseapp.com",
  databaseURL: "https://thanksmemo-19012.firebaseio.com",
  projectId: "thanksmemo-19012",
  storageBucket: "thanksmemo-19012.appspot.com",
  messagingSenderId: "482108959359"
};
firebase.initializeApp(config);
//firebaseEmailAuth = firebase.auth();
//firebaseDatabase = firebase.database();