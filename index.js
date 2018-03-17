var express = require('express');
var morgan = require('morgan');
var path = require('path');
var mysql=require('mysql');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
var nodemailer=require('nodemailer');
var generator = require('generate-password');
var config = require('./config');
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');


var pool = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    database: 'blog_app',
    port: '3306',
    password: process.env.DATABASE_PASSWORD
});

var transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS
  }
});

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'SomeRandomSecretValue',
    cookie: { maxAge: 1000*60*60*24*30 }
}));

var dir = {
	'settings': {
		heading: 'Settings',
		content: `
    <br>
		<center>
			<div>
				<h4>Update password credentials</h4>
			<div>
				<form>
        <div class="input-group">
          <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-lock"><img src="/node_modules/octicons/build/svg/lock.svg"></i></span></button>
          <input type="password" placeholder="Password" id="password" class="form-control"> &nbsp &nbsp
        </div>
        <button onclick="javascript:document.forms[0].submit();" value="Update Credentials" type="button" class="btn btn-primary" id="updateCred_btn">Submit</button>
				</form>
			</div>
			</div>
      <div>
      <br><br>
      <h4>Set icon</h4>
      <div>
      <form action="userPicUpload" method="post" enctype="multipart/form-data">
      <input type="file" class="btn btn-info" name="filetoupload"> &nbsp &nbsp
      <button class="btn btn-primary" onclick="javascript:document.forms[0].submit();">Submit</button>
      </form>
      </div>
      </div>
      <br>
      <hr>
      <br>
      <a href="/logout"><button class="btn btn-warning">Logout</button></a>
      <button class="btn btn-danger" title="Delete Account - Danger" data-toggle="popover" data-trigger="focus" data-html="true" data-content="<p>Are you sure? This <code>cannot</code> be undone</p><a href='/delete-account'>Delete Account?</a>">
      Delete Account
      </button>
		</center>
			<script src="/ui/update_cred.js"></script>
		`
	},
	'forgot_password': {
		heading: '',
		content: `
			<center>
				<div id="login_area" class="fadeIn wow">
					<h3>Forgot Password</h3>
					<hr>
				<div>
					<br>
					<p>Forgot your password? Don't worry, type your username in and we'll send a new password to the Email associated with the account. Then you can login with the new password.</p>
					<form>
          <div class="input-group">
            <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-person"><img src="/node_modules/octicons/build/svg/person.svg"></i></span></button>
            <input type="text" placeholder="Username" id="username" class="form-control"> &nbsp &nbsp
          </div>

					<input class="btn btn-primary" value="Submit" type="submit" id="resetPwd_btn"/>
					</form>
				</div>
				</div>
			</center>
			<script src='/ui/reset_pwd.js'></script>
		`
	},
  'Sign-Up': {
    heading: '',
    content: `
<center>
    <div id="login_area" class="fadeIn wow">
        <h3>Sign Up</h3>
    <div>
        <form onsubmit="return false;">
        <div class="input-group">
          <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-person"><img src="/node_modules/octicons/build/svg/person.svg"></i></span></button>
          <input type="text" placeholder="Username" id="username" class="form-control"> &nbsp &nbsp
        </div>

    <div class="input-group">
      <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-lock"><img src="/node_modules/octicons/build/svg/lock.svg"></i></span></button>
      <input type="password" placeholder="Password" id="password" class="form-control"> &nbsp &nbsp
    </div>
        <div class="input-group">
          <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-mail"><img src="/node_modules/octicons/build/svg/mail.svg"></i></span></button>
          <input type="email" placeholder="Email" id="email" class="form-control"> &nbsp &nbsp
        </div>

        <button value="Sign Up" type="submit" id="register_btn" class="btn btn-primary" onclick="javascript:document.forms[0].submit(); validate('register');">Sign Up</button>
		</form>
    </div>
    </div>
</center>
    <script src="/ui/register.js"></script>
    <script src="ui/common.js"></script>

    `
    },
  'Login': {
    heading:'',
    content:`
<center>
    <div id="login_area" class="fadeIn wow">
        <h3>Login</h3>
    <div>
		<form onsubmit="return false;">
    <div class="input-group">
      <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-person"><img src="/node_modules/octicons/build/svg/person.svg"></i></span></button>
      <input type="text" placeholder="Username" id="username" class="form-control"> &nbsp &nbsp
    </div>

        <div class="input-group">
          <button class="btn form-control" disabled><span class="input-group-addon"><i class="octicon octicon-lock"><img src="/node_modules/octicons/build/svg/lock.svg"></i></span></button>
          <input type="password" placeholder="Password" id="password" class="form-control"> &nbsp &nbsp
        </div>

        <button value="Login" type="button" class="btn btn-primary" id="login_btn" onclick="validate('login');">Login</button>
		</form>
		<br>
		<a id="forgotPwd" href="/dir-forgot_password">Forgot password?</a>
    </div>
    </div>
</center>
    <script src="/ui/login.js"></script>
    <script src="ui/common.js"></script>
    `
  },
  'Home': {
    heading:'',
    content:`
<!--
    <div style="width:1150px; vertical-align:middle; height:700px;" class="bg-info">
    <center>
    <br><br><br>
    <img src="/ui/laptop.jpg" class="rounded-circle"><br>
    <br><br><br>
    <p style="font-size: 6rem; color: white;">"Expert coders"</p>
    <center>
    </div>
    -->
    <div id="demo" class="carousel slide" data-ride="carousel" style="width:1150px; height:700px;">

      <!-- Indicators -->
      <ul class="carousel-indicators">
        <li data-target="#demo" data-slide-to="0" class="active"></li>
        <li data-target="#demo" data-slide-to="1"></li>
        <li data-target="#demo" data-slide-to="2"></li>
      </ul>

      <!-- The slideshow -->
      <div class="carousel-inner">
      <div class="">
        <div class="carousel-item active">
        <div style="width:1150px; vertical-align:middle; height:700px;" class="bg-info">
        <center>
        <br><br><br>
        <img src="/ui/laptop.jpg" class="rounded-circle"><br>
        <br><br><br>
        <p style="font-size: 6rem; color: white;">"Expert web coder"</p>
        <center>
        </div>
        </div>
        <div class="carousel-item">
        <div style="width:1150px; vertical-align:middle; height:700px;" class="bg-info">
        <center>
        <br><br><br>
        <img src="/ui/piano.jpg" class="rounded-circle"><br>
        <br><br><br>
        <p style="font-size: 6rem; color: white;">"Piano lover"</p>
        <center>
        </div>
        </div>
        <div class="carousel-item">
          <div style="width:1150px; vertical-align:middle; height:700px;" class="bg-info">
            <center>
              <br><br>
              <img src="/ui/github.jpg"><br>
              <p style="font-size: 6rem; color: white;"><a href="https://github.com/EpicThunderZ" target="_blank"><button class="btn btn-primary"><h3>Programs on <img src="node_modules/octicons/build/svg/logo-github.svg"></h3></button></a></p>
            <center>
          </div>
        </div>
      </div>
    </div>
    </div>

      <!-- Left and right controls -->
      <a class="carousel-control-prev" href="#demo" data-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </a>
      <a class="carousel-control-next" href="#demo" data-slide="next">
        <span class="carousel-control-next-icon"></span>
      </a>
    </div>

    <div class="row bg-info" style="padding: 15px;">
      <br>
      <div class="col-sm">
        <div class="card img-fluid bg-success" style="color: white; width:100%; height:100%;" id="Profile">
        <center>
          <img class="card-img rounded" src="/ui/photo.jpg" alt="Card image" style="width:60%; height:60%;">
        </center>
          <div class="card-body">
            <h4 class="card-title">Profile</h4>
            <p class="card-text">I'm in 7<sup>th</sup> grade. Hi, I'm Janak Shah, an aspiring expert web programmer. I'm in 7<sup>th</sup> grade. Hi, I'm Janak Shah, an aspiring expert web programmer.</p>
            <a href="https://github.com/EpicThunderZ" target="_blank" class="btn btn-primary">See Github Profile</a>
          </div>
        </div>
      </div>
      <div class="col-sm rounded">
        <div class="row" id="About">
          <div class="col-sm">
            <div class="card img-fluid" style="width:100% height:100%">
              <div class="card-body">
                <h4 class="card-title">About Me</h4>
                <p class="card-text">Hi, I'm Janak Shah, an aspiring expert web programmer. I'm in 7<sup>th</sup> grade.</p>
                <a href="#" target="_blank" class="btn btn-primary">Read More</a>
              </div>
            </div>
          </div>
        </div>

        <div class = "row"  id="Achievements">
            <div class="col-sm">
              <div class="card img-fluid" style="width:100% height:100%">
                <div class="card-body">
                  <h4 class="card-title">Achievements</h4>
                  <p class="card-text">Hi, I'm Janak Shah, an aspiring expert web programmer. I'm in 7<sup>th</sup> grade. </p>
                  <a href="#" target="_blank" class="btn btn-primary">Read More</a>
                </div>
              </div>
            </div>
          </div>

          <div class = "row" id="Programs">
              <div class="col-sm">
                <div class="card img-fluid" style="width:100% height:100%">
                  <div class="card-body">
                    <h4 class="card-title">My Programs</h4>
                    <p class="card-text">Hi, I'm Janak Shah, an aspiring expert web programmer. I'm in 7<sup>th</sup> grade.</p>
                    <a href="#" target="_blank" class="btn btn-primary">See More!</a>
                  </div>
                </div>
              </div>
            </div>

      </div>


    </div>

    `
  },
  'About_Me': {
    heading:'About Me',
    content:'About-Me'

  },
  'Web_Programs': {
    heading:'Programs',
    content:`
        <div id="programs" class="fadeIn wow"><center> Loading Programs... </center></div>
        <script src="/ui/get-articles.js"></script>
        <script src="/ui/comments.js"></script>
    `
  },

};

function createTemplate(data) {
var heading= data.heading;
var title= "Blog-Lightnin | " + heading;
var content= data.content;
var titleBar=
`
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="icon" src="/ui/favicon.ico">
  <title>LightninTh5426 Blog</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="/ui/pace/pace-1.0.2/pace.js"></script>
  <link href="/ui/pace/pace-1.0.2/themes/orange/pace-theme-flash.css" rel="stylesheet" />
  <script>
  paceOptions = {
  ajax: false, // disabled
  document: false, // disabled
  eventLag: false, // disabled
  restartOnRequestAfter: false, // disabled
  elements: {

  }
};
</script>
<link rel="stylesheet" href="C:/Users/rekhasha/Desktop/Janak_HTML_Programs/Main-Dev/node_modules/primer-css/build/build.css">
<link rel="stylesheet" href="C:/Users/rekhasha/Desktop/Janak_HTML_Programs/Main-Dev/node_modules/octicons/build/build.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Port+Lligat+Sans" rel="stylesheet">
	<link href="/ui/style.css" rel="stylesheet"/>


    </head>
    <body style="background-color:black;">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top" >
      <!-- Brand/logo -->
      <a class="navbar-brand" href="#">
        <img src="/ui/favicon.ico" class="rounded" alt="logo" style="width:40px; height:40px;">
        LightninTh5426 - Blog
      </a>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>

      <!-- Links -->
      <div class="collapse navbar-collapse " id="collapsibleNavbar">
      <ul class="navbar-nav" >

        <li class="nav-item">
          <a class="nav-link" href="/Profile">Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/About">About Me</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/Achievements">Achievements</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/Web_Programs">My Programs</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/Contact">Contact Me</a>
        </li>

        <li class="nav-item navbar-right form-inline" >
        <div class="btn-group navbar-btn"id="login_buttons" >
            <button type="button" onclick="window.location.href='/Login'" class="btn btn-secondary">Login</button>
            <button type="button" onclick="window.location.href='/Sign-Up'" class="btn btn-secondary">Sign Up</button>
        </div>
        </li>
      </ul>
    </div>
    </nav>
    <br><br>
    <div class="container" style="background:white; padding: 0px;  overflow: hidden !important;">


`;
var body=`
  <center><h3 id="heading"><u>${heading}</u></h3></center>

  <div id="content">
      ${content}
  </div>

    </div>

  </div>
  <br><br>
  <footer class="bg-dark">
    © Janak Shah<img src="node_modules/octicons/build/svg/zap.svg"> |  <a href="https://github.com/EpicThunderZ"><img src="node_modules/octicons/build/svg/mark-github.svg"> <img src="node_modules/octicons/build/svg/logo-github.svg"></a>
  </footer>
  <script src="/ui/check-login.js"></script>
  <script>
  $(document).ready(function(){
      $('[data-toggle="popover"]').popover();
  });
  $(document).on('click', '[data-toggle="popover"]', function (e) {
    //
    // If popover is visible: do nothing
    //
    if ($(this).prop('popShown') == undefined) {
       $(this).prop('popShown', true).popover('show');
    }
});
/*
$(function () {
    $('[data-toggle="popover"]').on('hide.bs.popover', function (e) {
        //
        // on hiding popover stop action
        //
        e.preventDefault();
    });
});
*/
$(document).ready(function(){
    $('[title]').tooltip();
});
  </script>
<script>console.log(document.getElementById('body'));</script>
  </body>
</html>
`;
var HTMLtemplate=titleBar+body;
return HTMLtemplate;
}
/*
function createProgramTemplate(data) {
var heading= data.heading;
var link=data.link;
var type=data.type;
var date= data.date;
var title= "Blog-Lightnin | " + heading;
var content= data.content;
var titleBar=`
<html>
    <head>
        <title>${title}</title>
        <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/3.18.1/build/cssreset/cssreset-min.css">
        <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
        <link href="/ui/style.css" rel="stylesheet"/>
    </head>
    <body>
      <DIV id="titlebar">
        <br>
        <a href="/dir-Home"><img id="logo" src="/ui/LOGO.png" alt="Logo"></a>
        <div class="dropdown">
          <a href="/dir-Home"><button class="dropbtn" id="Home">Home</button></a>
          <a href="/dir-About-Me"><button class="dropbtn" id="About">About Me</button></a>
          <a href="/dir-Web-Programs"><button class="dropbtn" id="Programs">Web Programs</button></a>
          <a href="/dir-Learn"><button class="dropbtn" id="Learn">Learn</button></a>
          <a href="/dir-Help"><button class="dropbtn" id="Help">Help</button></a>
          <div id="login_buttons">
          <a href="/dir-Sign-Up"><button class="dropbtn specialB" id="SignUpB"">Sign Up</button></a>
          <a href="/dir-Login"><button class="dropbtn specialB" id="LoginB">Login</button></a>
          </div>
        <!--<p id="name">Janak Shah- <span id="username">LightninTh5426@EpicThunder</span></p>-->

      </DIV>

      <br><br>
`;
var body=`
   <div class="gotProgram">
    <div class="ProgramHead">
        <a target="_blank href="/ui/Programs/${type}/Calculator/${link}">${heading}</a>
        <p><b>${date.toDateString()}</b></p>
    </div>
    <p>${content}</p>
    <div class="comment_area">
        <br><hr>
       <div style="text-align: center;"><a href="/dir-Web-Programs/Comment/Program-one">Comment</a></div>
        <hr>
    </div>
    </div>
    <br>
    <br>
    <script src="/ui/check-login.js"></script
	<script>console.log(document.getElementById('body'));</script>
</html>
`;
var HTMLtemplate=titleBar+body;
return HTMLtemplate;
}
*/
app.get('/', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash (input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}
var rLimit=4;
var lLimit=4;
app.get('/register-validate-input', function(req, res) {
	var user=req.query.username;
	var pwd=req.query.password;
	var email=req.query.email;
	var cred = [user, pwd, email];
	if(user.length>rLimit && pwd.length>rLimit && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		res.send('Success');
	} else {
		res.send('Failure');
	}
});

app.get('/login-validate-input', function(req, res) {
	var user=req.query.username;
	var pwd=req.query.password;
	var cred = [user, pwd];
	if(user.length>lLimit && pwd.length>lLimit) {
		res.send('Success');
	} else if(user.length<=lLimit && pwd.length>lLimit){
		res.send('username');
	} else if(user.length>lLimit && pwd.length<=lLimit) {
		res.send('password');
	} else if(user.length<=lLimit && pwd.length<=lLimit) {
		res.send('usernamepassword');
	} else {
		res.send('Something went wrong on the server.');
	}
});

app.get('/hash/:input', function(req,res) {
    var hashedString=hash(req.params.input, 'random-string');
    res.send(hashedString);
});

app.post('/create-user', function(req, res) {
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString=hash(req.body.password, salt);
    pool.query("INSERT INTO `user`(`username`,`password`,`email`) VALUES ('"+req.body.username+"','"+dbString+"', '"+req.body.email+"')", function(err, field, result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.send('User successfully created' + req.body.username);
        }
    });



});

app.post('/login', function(req, res) {
    pool.query("SELECT * FROM `user` WHERE `username` = '"+req.body.username+"' ", function(err, result, field) {
        if(err) {
            res.status(500).send(err.toString());
        } else {
            if(result.length === 0) {
                res.status(400).send('Username/Password is invalid');
            }
            else{
				var password=req.body.password;
                 var dbString = result[0].password;
                 var salt = dbString.split('$')[2];
                 var hashedPassword = hash(password, salt);
                 if(hashedPassword === dbString) {
                   req.session.auth = {"userId": result[0].username, "userIdNumber":result[0].id};
                   userPicArray=[];
                   fs.readdirSync('./ui/UserPics/').forEach(file => {
                       userPicArray.push(file);
                   })
                   for(i=0;i<=userPicArray.length;i++) {
                     if(userPicArray[i]===req.session.auth.userIdNumber+'.jpg') {
                       var userPicName=userPicArray[i];
                       console.log(userPicName);
                     } else {

                     }
                   }
                     req.session.auth = {"userId": result[0].username, "userIdNumber":result[0].id, "userPicName":userPicName};
                     console.log(req.session.auth);
                     res.send('Credentials correct');
                   } else{
                     res.status(403).send('Username/Password is invalid');
                   }
                 }
        }

    });
});
app.get('/current-user-pic', function(req, res) {
  if(req.session && req.session.auth && req.session.auth.userId && req.session.auth.userIdNumber) {
    userPicArray=[];
    fs.readdirSync('./ui/UserPics/').forEach(file => {
        userPicArray.push(file);
    })
    for(i=0;i<=userPicArray.length;i++) {
      if(userPicArray[i]===req.session.auth.userIdNumber+'.jpg') {
        var userPicName=userPicArray[i];
        console.log(userPicName);
      } else {

      }
    }
    if(userPicName) {
      res.sendFile(path.join(__dirname, 'ui/UserPics/', userPicName));
    }
  } else {
    res.send('You are not logged in');
  }
});
app.get('/current-user-pic-name', function(req, res) {
  if(req.session && req.session.auth && req.session.auth.userId && req.session.auth.userIdNumber) {
    userPicArray=[];
    fs.readdirSync('./ui/UserPics/').forEach(file => {
        userPicArray.push(file);
    })
    for(i=0;i<=userPicArray.length;i++) {
      if(userPicArray[i]===req.session.auth.userIdNumber+'.jpg') {
        var userPicName=userPicArray[i];
        console.log(userPicName);
      } else {

      }
    }
    if(userPicName) {
      res.send(userPicName);
    }
  } else {
    res.send('You are not logged in');
  }
});
app.post('/userPicUpload', function(req, res) {
  //set the pic as the username(unique)
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/rekhasha/Desktop/Janak_HTML_Programs/Main-Dev/ui/UserPics/' +req.session.auth.userIdNumber+'.jpg' ;
      fs.rename(oldpath, newpath, function (err) {
        if(err) {console.log(err);} else {
        console.log('File uploaded and moved!');
      }
      });
    });
 });
app.post('/send-password_email', function(req, res) {
	pool.query("SELECT * FROM `user` WHERE `username` = '"+req.body.username+"' ", function(err, result, field) {
		if(err) {
			res.status(500).send(err.toString());
        }
		else {
            if(result.length === 0) {
                res.status(400).send('Username is invalid');
            }
            else{
				var email=result[0].email;
				var dbString = result[0].password;
				var salt = dbString.split('$')[2];
				var password = generator.generate({
					length: 10,
					numbers: true
				});
				var hashedPassword=hash(password, salt);
				var mailOptions = {
				  from: process.env.EMAIL_AUTH_USER,
				  to: email.toString(),
				  subject: 'Your password',
				  text: "This is your new password for your account: '"+password+"' "
				};

				transporter.sendMail(mailOptions, function(error, info){
				  if (error) {
					console.log(error);
				  } else {
					console.log('Email sent: ' + info.response);
				  }
				});

				pool.query("UPDATE `user` SET password = '"+hashedPassword+"' WHERE username = '"+req.body.username+"'", function(err, result, field) {
					if(err) {
						res.send(err);
					} else {
						res.send(result);
					}
				});


			}
		}

	});
});

app.post('/credentials_update', function(req, res) {
	pool.query("SELECT * FROM `user` WHERE `username` = '"+req.session.auth.userId+"' ", function(err, result, field) {
		if(err) {
			res.status(500).send(err.toString());
        }
		else {
            if(result.length === 0) {
                res.status(400).send('Username is invalid');
            }
            else{
				var dbString = result[0].password;
				var salt = dbString.split('$')[2];
				var hashedPassword = hash(req.body.password, salt);
				pool.query("UPDATE `user` SET `password` = ? WHERE `username` = ?",[hashedPassword,req.session.auth.userId], function(err, result, field) {
					if(err) {
						res.send(err);
					} else {
						res.send(result);
					}
				});
			}
		}
	});
});

app.post('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       pool.query("SELECT * FROM `user` WHERE `username`='"+req.session.auth.userId+"'", function(err, result, field) {
		  if (err) {
			  res.send(err);
		  }  else {
			  var cred=[result[0].id, result[0].username, result[0].email];
			  res.send(cred);
		  }
	   });
   } else {
       res.status(400).send('You are not logged in.');
   }
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       pool.query("SELECT * FROM `user` WHERE `username`='"+req.session.auth.userId+"'", function(err, result, field) {
		  if (err) {
			  res.send(err);
		  }  else {
			  var cred=[result[0].username, result[0].password, result[0].email];
			  res.send(cred);
		  }
	   });
   } else {
       res.status(400).send('You are not logged in.');
   }
});

app.get('/logout', function(req, res) {
    delete req.session.auth;
    res.send('You have logged out.<br><a href="/">Home</a>');
});

app.get('/delete-account', function(req,res) {
    console.log(req.session.auth.userId);
    pool.query('DELETE FROM `user` WHERE `username` = ?', [req.session.auth.userId], function (err, fields, result) {
    if (err) {
        res.send('Error');
    } else{
    delete req.session.auth;
    res.send(`Your account has been deleted and you have logged out.<br><a href="/">Home</a>`);
	}
	});
});

//var pool = new Pool(config);
app.get('/get-programs', function(req,res) {
  pool.query("SELECT * FROM `programs` ORDER BY `date`", function (err, result, fields) {
    if(err) {
      res.send('Error');
    }
    res.send(result);
  });
});

app.get("/get-progComments", function(req,res) {
pool.query("SELECT * FROM `progComments` ORDER BY `date`", function (err, result, fields) {
    if(err) {
      res.send('error');
    }
    res.send(result);
  });

});

app.get("/get-progComments/:programName", function(req,res) {

pool.query("SELECT progComments.programs_tag, progComments.user_id, progComments.comment, progComments.date, user.username, user.email  FROM `progComments` ,`user` WHERE  progComments.user_id =user.id AND progComments.programs_tag=? ORDER BY `date` DESC",[req.params.programName], function (err, result, fields) {
    if(err) {
      res.send(err);
    } else {
    res.send(result);
  }

  });
});

app.post('/submit-progComment/:programName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from programs where tag = ?', [req.params.programName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.length === 0) {
                    res.status(400).send('Program not found');
                } else {
					console.log(result);
                    var programTag = result[0].tag;
                    // Now insert the right comment for this article
                    pool.query("INSERT INTO progComments (programs_tag, user_id, comment) VALUES (?, ?, ?)", [programTag, req.session.auth.userIdNumber, req.body.comment], function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

app.get('/:dirName',function (req, res) {
  var dirName = req.params.dirName;
		if(dir[dirName]) {
			res.send(createTemplate(dir[dirName]));
		} else {
			res.send('<h1 style="font-family:monospace;">ERROR 404 - Not Found</h1>')
		}
});

app.get('/test-db', function(req,res) {
  pool.query("SELECT * FROM `programs`", function (err, result, fields) {
    if(err) {
      res.send('error');
    }
    res.send(result);
  });
});


app.get('/programs/:programName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM programs WHERE tag = ?", req.params.programName, function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.length === 0) {
            res.status(404).send('Program not found');
        } else {
            var programData = result[0];
            res.send(createProgramTemplate(programData));
        }
    }
  });
});



app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});

app.get('/ui/Programs/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/Programs', req.params.fileName));
});
app.get('/ui/Programs/Math/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/Programs/Math/Calculator/', req.params.fileName));
});
app.get('/node_modules/octicons/build/svg/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'node_modules/octicons/build/svg/', req.params.fileName));
});

app.get('C:/Users/rekhasha/Desktop/Janak_HTML_Programs/Main-Dev/node_modules/primer-css/build/build.css', function (req, res) {
  res.sendFile(path.join('C:/Users/rekhasha/Desktop/Janak_HTML_Programs/Main-Dev/node_modules/primer-css/build/build.css'));
});

app.get('C:/Users/rekhasha/Desktop/Janak_HTML_Programs/Main-Dev/node_modules/octicons/build/build.css', function (req, res) {
  res.sendFile(path.join('C:/Users/rekhasha/Desktop/Janak_HTML_Programs/Main-Dev/node_modules/octicons/build/build.css'));
});
app.get('/ui/pace/pace-1.0.2/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/pace/pace-1.0.2/', req.params.fileName));
});

app.get('/ui/pace/pace-1.0.2/themes/:colorName/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/pace/pace-1.0.2/themes/',req.params.colorName,'/', req.params.fileName));
});
app.get('/ui/UserPics/:fileName', function (req, res) {
  /*
  fs.exists('./ui/UserPics/:fileName',function(exists){
    console.log(req.params.fileName);
    if(exists){
        console.log('yes');
        res.sendFile(path.join(__dirname, 'ui/UserPics/', req.params.fileName));
    }else{
        console.log("no");
        res.sendFile(path.join(__dirname, 'ui/UserPics/', 'photo2.jpg'))
    }
});
*/
fs.stat('./ui/UserPics/'+req.params.fileName, function(err, stat) {
    if(err == null) {
        console.log('File exists');
        res.sendFile(path.join(__dirname, 'ui/UserPics/', req.params.fileName));
    } else if(err.code == 'ENOENT') {
        // file does not exist
        //console.log(err);
        res.sendFile(path.join(__dirname, 'ui/UserPics/', 'photo2.jpg'));
    } else {
        console.log('Some other error: ', err);
    }
});

});

pool.connect(function(err, result) {
  if (err) {
      console.log('Error in connecting to MySQL Database.');
      console.log(result);
  } else{
  console.log("Connected!");
  console.log(result);
  }
});


var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('App listening at http://localhost:%s', port);

});
