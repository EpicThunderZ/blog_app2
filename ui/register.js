function loadLoginForm() {
    console.log(window.location.href);
        var loginHTML=`
            <H3>Profile</h3>
            <div>
			<form>
              <input type="text" id="username" placeholder="username"/>
              <input type="password" id="password"/>
				<input type="email" id="email"/>
              <br>
              <input type="submit" id="register_btn"/>
			</form>
          </div>
        `;
  }


var loginF2 = function() {
	var register = document.getElementById("register_btn");

    var request = new XMLHttpRequest();
    register.value="Logging you in...";
    register.disabled=true;
    //Capture the response and store it in a variable
     request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  register.disabled=false;
                  register.value="Sign Up";
               } else if(request.status===403 || request.status===400 ) {
                   alert('Username/Password invalid');
                   register.disabled=false;
                   submit.value="Sign Up";
               } else if (request.status===500) {
				 
                   alert('Something went wrong on the server.(ERROR 500)');
                   register.disabled=false;
                  register.value="Sign Up";
               } else{
				   console.log(request.status);
                   alert('Something went wrong on the server.');
                   register.disabled=false;
                  register.value="Sign Up";
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
var registerF = function () {
    //Create a request object
	var register = document.getElementById("register_btn");

    var request = new XMLHttpRequest();
    register.value="Registering you...";
    register.disabled=true;
    //Capture the response and store it in a variable
             request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('We have created your account successfully!!!');
                  register.value = 'Sign Up';
                  register.disabled=false;
				  loginF2();
			  } else if(request.status===403) {
				  alert('The username or email given is already in use. Please select another.');
				  register.value = 'Sign Up';
                  register.disabled=false;
			  
              } else if(request.status===500) {
                  alert('The username or email given is already in use. Please select another.');
				  register.value = 'Sign Up';
                  register.disabled=false;
				  
                  register.value = 'Sign Up';
                  register.disabled=false;
              }
			  else {
				  console.log(request.status);
				  alert('Oops... We couldn\'t register you... (ERROR '+request.status+')');
			  }
          }
        };
		
        var username=document.getElementById('username').value;
	console.log(username);
        var password = document.getElementById('password').value;
	console.log(password);
		var email = document.getElementById('email').value;
	console.log(email);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password, email: email}));
        
    };

