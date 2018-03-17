var resPWD = document.getElementById("resetPwd_btn");
resPWD.onclick = function () {
    //Create a request object
    var request = new XMLHttpRequest();
	//Capture the response and store it in a variable
	resPWD.disabled=true;
	resPWD.value='Requesting server... ';
	request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
               if(request.status===403 || request.status===400 ) {
                   alert('This username does not exist. Please try again.');
                   resPWD.disabled=false;
                  resPWD.value="Submit";
               } else{
                   alert('Please check your mail. In case you have not recieved your new password, retry again and ensure Good Internet Connection.')
                   resPWD.disabled=false;
                  resPWD.value="Submit";
               }
               
            }
        };
     
	

        var username=document.getElementById('username').value;
        request.open('POST', '/send-password_email', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username}));
		
	    
        
    };