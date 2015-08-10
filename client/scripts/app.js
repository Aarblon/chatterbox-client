// YOUR CODE HERE:

var app = {
  chatRooms: {},
  init: function(){
    //Setting up click handler to trigger addFriend when username clicked
    app.fetch();

    $(document).ready(function(){
      $('body').on('click', '.username', function(){
        app.addFriend();
      });
      $('#send .submit').on('submit',
        app.handleSubmit
      );
      $('.addRoom form').on('submit', function(event) {
        event.preventDefault();
        app.addRoom($(this).find("#newRoom").val());
      });
    });

  },
  send: function(message){

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    })
  },
  fetch: function(){

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {

        //var currentRooms = app.cacheChatRooms();

        data.results.forEach(function(chatObject) {
          app.addMessage(chatObject);
          if(app.chatRooms[chatObject.roomname] === undefined){
            app.addRoom(chatObject.roomname);
          }
        });
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    })
  },
  clearMessages: function(){
    $('#chats').html("");
  },
  addMessage: function(message){
    var newDiv = $('<div class="chatLine"></div>');
    var userSpan = $('<span class="username"></span>').text(message.username + ": ");
    var messageSpan = $('<span class="messageText"></span>').text(message.text);

    $('#chats').append( newDiv.append(userSpan).append(messageSpan) );

  },
  addRoom: function(roomName){
    if(app.chatRooms[roomName] === undefined) {
      $('#roomSelect').append('<option id="' + roomName + '">' + roomName + '</option>');
      app.chatRooms[roomName] = 1;
    }
  },
  addFriend: function(){

  },
  handleSubmit: function(event){
    event.preventDefault();
    var message = $(this).find("#message").val();
    var username = window.location.search.split('=')[1];
    app.send({"username": username, "text": message, "roomname": "lobby"});
  }
};


app.init();

    //check to see if room exists
    // if($("#chats").find('#'+ message.roomname).length === 0 ) {
    //   $('#chats').append('<div id='+ message.roomname + '></div>'));
    // }

    // $('#' + message.roomname).append()





