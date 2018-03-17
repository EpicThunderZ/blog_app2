function loadLoggedInUser(login, username, password, email) {
    var parentButtons = document.getElementById('login_buttons');
	if(document.getElementById('login_area')) {
	var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
        <h3><i> ${username} </i></h3>
		<br>
		<form>
		<P>
		<b>Username: </b>
		<input type="text" value='${username}' class="form-control" disabled>
		<br><br>
		<b>Email: &nbsp &nbsp &nbsp &nbsp &nbsp</b>
		<input type="email" value='${email}' class="form-control" disabled>
		</P>
		<br><br>
		</form>
		<a href="/settings"><button class="btn btn-info" style='font-size: 0.8em; height: 30px;'>Profile Settings</button></a>
	<br><br><br>
        <a href="/logout"><button class="btn btn-warning">Logout</button></a>


        <a href="#" title="Delete Account - Danger" data-toggle="popover" data-trigger="focus" data-content="Are you sure you want to delete your account? This cannot be undone.<a href='/delete-account'></a>"><button class="btn btn-danger">Delete Account</button></a>


<script>
$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
});
</script>
		<script src='/ui/update_cred.js'></script>
    `;
	}
    parentButtons.innerHTML=`
        <a href="/Login"><button class="btn btn-primary" >${username}</button></a>
    `

}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
				var output = JSON.parse(this.response);
				loadLoggedInUser(output, output[0], output[1], output[2]);
            } else {
               // loadLoginForm();
            }
        }
    };

    request.open('POST', '/check-login', true);
	request.send(null);
}


loadLogin();

var validate=function(type) {
	var request = new XMLHttpRequest();
	var btn = document.getElementById(type+'_btn');
	console.log(btn);
	btn.disabled=true;
  console.log(request);
    //Capture the response and store it in a variable
    request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              console.log(request.status);
              if (request.status === 200) {
				  var resp = this.response;
				  console.log(resp);
				  if(resp==='Success') {
					  if(type==='register') {
						  btn.value='Registering you...';
              console.log("start");
						 registerF();
					  } else if(type==='login'){
						  btn.value='Logging you in...';
						  loginF1();
					  } else {
						  alert('Wrong type... Something went wrong on the server.');
					  }
				  } else if(resp==='email'){
					  btn.disabled=false;
					  alert('Invalid Email. Please type your email in the correct format.');
				  } else if(resp==='username') {
					  btn.disabled=false;
					  alert('Invalid Username. Your username should be more than 4 characters.');
				  } else if(resp==='password') {
					  btn.disabled=false;
					  alert('Invalid password. Your password should be more than 4 characters.');
				  } else if(resp==='Failure') {
					  btn.disabled=false;
					  alert('Invalid credentials. Your password and username should be more than 4 characters. Please type your email in the correct format');
				  } else if(resp==='usernamepassword') {
					  btn.disabled=false;
					  alert('Invalid password and username. Your password and username should be more than 4 characters.');
				  } else if(resp==='passwordemail') {
					  btn.disabled=false;
					  alert('Invalid password and email. Your password should be more than 4 characters. Please type your email in the correct format.');
				  } else if(resp==='usernameemail') {
					  btn.disabled=false;
					  alert('Invalid email and username. Your username should be more than 4 characters. Please type your email in the correct format.');
				  } else {
					  alert('Something went wrong while processing your credentials.');
					  console.log(request.status);
				  }
              } else {
				  alert('Something went wrong on the server.');
              }
          }
        };

        var username=document.getElementById('username').value;
		console.log(username);
        var password = document.getElementById('password').value;
		console.log(password);
		if(document.getElementById('email')) {
			var email = document.getElementById('email').value;
			console.log(email);
		}
		if(email) {
        request.open('GET', '/'+type+'-validate-input?username='+username+'&password='+password+'&email='+email, true);
		} else {
			request.open('GET', '/'+type+'-validate-input?username='+username+'&password='+password, true);
		}
		request.send(null);
    };
