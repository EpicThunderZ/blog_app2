function loadUpdateForm() {
    console.log(window.location.href);
        var loginHTML=`
            <h4>Update credentials</h4>
			<div>
				<form>
				<input type="password" placeholder="Password" id="password"/>
				<br><br>
				<input value="Update Credentials" type="submit" id="updateCred_btn"/>
				</form>
			</div>
        `;
  }



var submit = document.getElementById("updateCred_btn");
submit.onclick = function () {
    //Create a request object
    var request = new XMLHttpRequest();
    submit.value="Update Credentials";
    submit.disabled=true;
    //Capture the response and store it in a variable
     request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.disabled=false;
                  submit.value="Update Credentials";
                  alert('Success!');
               } else if(request.status===403 || request.status===400 ) {
                   alert('Username/Password invalid');
                   submit.disabled=false;
                  submit.value="Update Credentials";
               } else if (request.status===500) {
                   alert('Something went wrong on the server.');
                   submit.disabled=false;
                  submit.value="Update Credentials";
               } else{
                   alert('Something went wrong on the server.');
                   submit.disabled=false;
                  submit.value="Update Credentials";
               }
      
            }
        };

        var password = document.getElementById('password').value;
        request.open('POST', '/credentials_update', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({password: password}));
    };