// Initialize Firebase
var firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
var firebaseDatabase; //파이어베이스 db 모듈 전역변수
var name; //유저 이름
var loginUserKey; //로그인한 유저의 부모 key
var userInfo; //로그인한 유저의 정보 object type
var config = {
    apiKey: "AIzaSyBDamDhJR5eLnAeDsjVUxL5GpSOa4nNYkU",
    authDomain: "break-a4931.firebaseapp.com",
    databaseURL: "https://break-a4931.firebaseio.com",
    projectId: "break-a4931",
    storageBucket: "break-a4931.appspot.com",
    messagingSenderId: "717477751137"
};

//firebaseEmailAuth = firebase.auth();
//firebaseDatabase = firebase.database();
//파이어베이스 초기화
firebase.initializeApp(config);
//인증모듈 객체 가져오기
firebaseEmailAuth = firebase.auth();
//데이터베이스 모듈객체 가져오기
firebaseDatabase = firebase.database();



    //세션 체크 함수
    userSessionCheck();
    //유저가 로그인 했는지 안했는지 확인해주는 함수
    function userSessionCheck() {

    //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
    firebaseEmailAuth.onAuthStateChanged(function (user) {
      if (user) {
      //조회 - 데이터 베이스에 저장된 닉네임을 현재 접속되어 있는 user의 pk key 값을 이용해서 가져오기
      firebaseDatabase.ref("users/" + user.uid).once('value').then(function (snapshot) {

        //자바스크립트 dom 선택자를 통해서 네비게이션 메뉴의 엘리먼트 변경해주기
        document.getElementById("loginmenu").textContent = "Logout";
        document.getElementById("loginmenu").href = "./logout.html";
        document.getElementById("signupmenu").textContent = "welcome! " + snapshot.val().name;
        document.getElementById("signupmenu").href = "#";
        name = snapshot.val().name;   //유저 닉네임은 계속 쓸거기 때문에 전역변수로 할당
        loginUserKey = snapshot.key;  //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
        userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
        
        //alert(user.uid);  //uid는 db에서 user 테이블의 각 개체들의 pk 인데, 이 값은 인증에서 생성된 아이디의 pk 값과 같다. *중요!
        return true
      });
      }else {
        $(document).ready(function(){
          $('.Leaderboard').val("login to see the leaderboard!");
        })
        return false
      }
    });
  }
