// YOUR CODE HERE:

var app = {
  currentRoom: "Lobby",
  chatRooms: { "Lobby": 1 },
  init: function(){
    //Setting up click handler to trigger addFriend when username clicked
    app.currentRoom = String(window.location.search).split('room=')[1] || "Lobby";
    $("select").val([]);
    $('[value="' + app.currentRoom + '"]').attr('selected', 'selected');

    app.fetch();

    setInterval(function() {
      app.fetch()
      }, 1000);

    $(document).ready(function(){
      $('body').on('click', '.username', function(){
        app.addFriend();
      });
      $('#send .submit').on('submit',
        app.handleSubmit
      );
      $('#roomSelect').on('change', function(event){
        var currentLocation = String(window.location).split('&')[0];
        window.location = currentLocation + "&room=" + $(this).val();
      });
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
        app.clearMessages();
        data.results.forEach(function(chatObject) {
          if(chatObject.roomname === app.currentRoom) {

            app.addMessage(chatObject);
          }
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



/*
TO DO LIST:
Post current room update, set the correct option as selected.

Fix username when chatting.

When chatting, make roomname = to current room

Add a header representing the current room

*/
