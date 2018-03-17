function loadPrograms() {
    "use strict";
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var programs = document.getElementById('programs');
            if (request.status === 200) {
                var content = ` `;
                var programData = JSON.parse(this.responseText);
                for (var i=0; i< programData.length; i++) {
                    content += `
                    <div class="card" style="width: 100%">
                      <div class="card-body">
                        <h4 class="card-title"><a target="_blank" href="/ui/Programs/${programData[i].type}/${programData[i].link}">${programData[i].heading}</a> &nbsp <span style="font-size:10px;" class="badge badge-info">${programData[i].type}</span></h4>
                        <p class="card-text">${programData[i].content}</p>
                        <a href="/ui/Programs/${programData[i].type}/${programData[i].link}" target="_blank" class="btn btn-primary">See Program</a>
                        <button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#${(programData[i].tag)}_CommentBoxParCollapser">Comment</button>
                        <button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#${(programData[i].tag)}_showCom" id="${(programData[i].tag)}_ShowCom" onclick="showCom('${((programData[i].tag))}');">See all comments</button>
                        <hr>
                        <center>
                        <div id="${(programData[i].tag)}_CommentBoxParCollapser" class="collapse">
                        <div class="commentBoxPar" id="${(programData[i].tag)}_CommentBoxPar">
                            <TEXTAREA id="${(programData[i].tag)}_commentBox" style="overflow:auto; width: 70%; height: 10%; max-width: 70%; max-height: 20%; min-width: 70%; min-height: 20%;" class="commentBox"> </TEXTAREA>
                        </div>

                        <div class="commentDiv" id="${(programData[i].tag)}_CommentDiv">
                        <div class="commentB" id="${(programData[i].tag)}_CommentB">
                          <button id="${(programData[i].tag)}_commentB" onclick="commentF('${(programData[i].tag)}');">Comment</button>
                        </div>

                      </div>
                      </center>
                      <div class="alert alert-success alert-dismissible fade show" id="${(programData[i].tag)}_alert" style="display:none;">
                      <button type="button" class="close" data-dismiss="alert" style="${(programData[i].tag)}_alert:hover {background:;}">&times;</button>
              <strong>Success!</strong> Comment inserted!
            </div>
                      <hr>

                      <div id="${(programData[i].tag)}_showCom"></div>
                        </div>
                      </div>
                    </div>

                    <!--
                    <div class="gotProgram fadeIn wow" data-wow-duration="1s">
                    <div class="ProgramHead">
                        <a target="_blank" href="/ui/Programs/${programData[i].type}/${programData[i].link}">${programData[i].heading}</a>
                        <p><b>${programData[i].date.split('T')[0]}</b></p>
                    </div>
                    <p>${programData[i].content}</p>
                    <div class="comment_area">
                        <br><hr>
                        <div style="text-align:center;">
                        <div class="ShowCom">
							<button class="ShowComBox" onclick="openComBox('${((programData[i].tag))}');">Comment</button>
                            <button id="${(programData[i].tag)}_ShowCom" onclick="showCom('${((programData[i].tag))}');">Show All Comments</button>
                        </div>
                        </div>
                    <hr>
                    </div>
                    <div id="comments_${((programData[i].tag))}"></div>
                    </div>
                    -->
                    <br>
                    <br>

                    `;
                }
   /* <HR>

                        <div class="commentBoxPar" id="${programData[i].tag}_CommentBoxPar">
                            <TEXTAREA id="${programData[i].tag}_commentBox" style="overflow:auto; width: 70%; height: 100%; max-width: 70%; max-height: 100%; min-width: 70%; min-height: 100%;" class="commentBox"> </TEXTAREA>
                        </div>

                        <div class="commentDiv" id="${programData[i].tag}_CommentDiv">
                        <div class="commentB" id="${programData[i].tag}_CommentB"><button>Comment</button></div>
                        <div class="ShowCom" id="${programData[i].tag}_ShowCom"><button>Show All Comments</button></div>
                        </div>
                        </div>*/
                console.log(content);
                programs.innerHTML = content;
            } else {
                programs.innerHTML='Oops! Could not load all articles!';
            }
        }
    };

    request.open('GET', '/get-programs', true);
    request.send(null);
}

loadPrograms();
