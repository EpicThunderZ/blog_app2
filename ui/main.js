//Submit username/password to login
function loadLoginForm() {
    var loginHTML;
    if(window.location.href==="http://localhost:3000/dir-Login") {
      console.log(window.location.href);
      LoginHTML=`
      <H3>Login</H3>
     <div>
          <input type="text" id="username" placeholder="username"/>
          <input type="password" id="password"/>
          <br>
          <input type="submit" id="login_btn"/>
      </div>
      `;
    }
    if(window.location.href==="http://localhost:3000/dir-Sign-Up") {
      console.log(window.location.href);
      LoginHTML=`
      <H3>Login</H3>
     <div>
          <input type="text" id="username" placeholder="username"/>
          <input type="password" id="password"/>
          <br>
          <input type="submit" id="register_btn"/>
      </div>
      `;
    }
}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    var loginButtons=document.getElementById('login_buttons');
    loginButtons.innerHTML=`
      <a href="/dir-Login"><button class="dropbtn specialB" id="ProfileB">${username}</button></a>
    `;
    loginArea.innerHTML = `
        <h3> Hi <i>${username}</i></h3>
        <a href="/logout"><button>Logout</button></a>
    `;
}
function loadLogin () {
    console.log("Loading login status")
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else if(request.status===400) {
                loadLoginForm();
            } else{
                loadLoginForm();
            }
        }
    };

    request.open('GET', '/check-login', true);
    request.send(null);
}

loadLogin();
