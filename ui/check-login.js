function loadLoginForm() {
      //console.log(window.location.href);
      var loginHTML = `
      <H3>Login</H3>
     <div>
		<form>
          <input type="text" id="username" placeholder="username"/>
          <input type="password" id="password"/>
          <br>
          <input type="submit" id="login_btn"/>
		</form>
      </div>
      `;


}
function loadLoggedInUser(login, id, username, email) {
    var parentButtons = document.getElementById('login_buttons');
	if(document.getElementById('login_area')) {
	var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
    <center>
    <div class="card img-fluid bg-dark" style="color: white; width:100% height:100%" id="Profile">
      <img class="card-img rounded" src="/ui/UserPics/${id}.jpg" alt="Card image" style="width:20%; height:20%; float: left;">
      <div class="card-body">
        <h4 class="card-title">Your Profile</h4>
        <p class="card-text">
        <form>
        <div class="row">
        <div class="col-sm">
        <div class="input-group">
          <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-person"><img src="/node_modules/octicons/build/svg/person.svg"></i></span>
          <input type="text" value="${username}" placeholder="Username" id="username" class="form-control" disabled></button>

        </div>
        <div class="input-group">
          <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-mail"><img src="/node_modules/octicons/build/svg/mail.svg"></i></span>
          <input type="email" value="${email}" placeholder="Email" id="email" class="form-control" disabled></button>
          </div>
          </div>
          <br>
          <div class="col-sm">
          <div class="input-group">
            <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-pencil"><img src="/node_modules/octicons/build/svg/pencil.svg"></i></span>
            <textarea value="Your Bio" placeholder="Bio" id="bio" class="form-control" disabled></textarea></button>
          </div>
          <br>
          <a href="/settings"><button class="btn btn-info"><img src="/node_modules/octicons/build/svg/settings.svg"> Profile Settings</button></a>
        &nbsp &nbsp
              <a href="/logout"><button class="btn btn-warning">Logout</button></a>
              </div>
        </p>
        </div>
      </div>
    </div>
    </center>
    <!--
    <img src="/ui/UserPics/${id}.jpg" style="height: 70%; width: 40%; float: left;">
		<form class="form-inline">
		<P>
		<b>Username: </b>
		<input type="text" value='${username}' class="form-control form-inline" disabled>
		<br><br>
		<b>Email: &nbsp &nbsp &nbsp &nbsp &nbsp</b>
		<input type="email" value='${email}' class="form-control form-inline" disabled>
		</P>
		<br><br>
		</form>
    -->




		<script src='/ui/update_cred.js'></script>
    `;
	}
    parentButtons.innerHTML=`
    <li class="nav-item">
      <a class="nav-link btn btn-dark dropdown-toggle" style="color: white;" href="#" id="navbardrop" data-toggle="dropdown">
        <img class="rounded-circle" style="height:42px; width:42px;" src="/ui/UserPics/${id}.jpg"> ${username}
      </a>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="/Login">Your Profile</a>
        <a class="dropdown-item" href="/Logout">Logout</a>
      </div>
      `

}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
				var output = JSON.parse(this.response);
        console.log(output);
				loadLoggedInUser(output, output[0], output[1], output[2]);
            } else {
                //loadLoginForm();
            }
        }
    };

    request.open('POST', '/check-login', true);
	request.send(null);
}


loadLogin();
