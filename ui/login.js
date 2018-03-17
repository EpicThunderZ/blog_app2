function loadLoginForm() {
    console.log(window.location.href);
        var loginHTML=`
            <H3>Profile</h3>
            <div>
			<form>
              <input type="text" id="username" placeholder="Username"/>
              <input type="password" placeholder="Password" id="password"/>
              <br>
              <input type="submit" id="login_btn"/>
			</form>
          </div>
        `;
  }

var loginF1 = function () {
    //Create a request object
    var submit=document.getElementById('login_btn');
	var request = new XMLHttpRequest();
    submit.value="Logging you in...";
    submit.disabled=true;
    //Capture the response and store it in a variable
     request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.disabled=false;
                  submit.value="Login";
                  alert('Success!');
               } else if(request.status===403 || request.status===400 ) {
                   alert('Username/Password invalid.');
                   submit.disabled=false;
                  submit.value="Login";
               } else if (request.status===500) {
                   alert('Something went wrong on the server.(ERROR 500)');
                   submit.disabled=false;
                  submit.value="Login";
               } else{
                   alert('Something went wrong on the server.');
                   submit.disabled=false;
                  submit.value="Login";
               }
               loadLogin();
            }
        };

        var username=document.getElementById('username').value;
        var password = document.getElementById('password').value;
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));
    };


	