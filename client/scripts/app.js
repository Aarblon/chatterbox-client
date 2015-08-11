// YOUR CODE HERE:

var app = {
  currentRoom: "Lobby",

  chatRooms: { "Lobby": 1 },

  friendsList: {},

  init: function(){
    app.setEventHandlers();

    app.makeCurrentRoomSelected();

    app.fetch();

    setInterval(function() {
      app.fetch()
      }, 1000);

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


    if(app.friendsList[message.username] === 1) {
      newDiv.addClass('friend');
    }

    $('#chats').append( newDiv.append(userSpan).append(messageSpan) );

  },
  addRoom: function(roomName){
    var newRoom  = $('<option></option>');
    newRoom.text(roomName);
    newRoom.attr('value', newRoom.text());

    if(app.chatRooms[newRoom.text()] === undefined) {
      $('#roomSelect').append(newRoom);
      app.chatRooms[newRoom.text()] = 1;
    }
  },
  addFriend: function(){
    var newFriend = $(this).text().split(':')[0];
    //toggle bold on new friend's chat
    $('.username').each(function(index, user){
      if($(user).text().split(':')[0] == newFriend){
        $(user).parent().toggleClass('friend');
        if(app.friendsList[newFriend] === 1){
          app.friendsList[newFriend] = undefined;
        } else {
          app.friendsList[newFriend] = 1;
        }
      }
    });
  },
  handleSubmit: function(event){
    event.preventDefault();
    var message = $(this).find("#message").val();
    var username = window.location.search.split('=')[1];
    app.send({"username": username, "text": message, "roomname": app.currentRoom});
  },

  makeCurrentRoomSelected: function(){
   $('[selected="selected"]').removeAttr('selected');
   $('option[value="' + app.currentRoom + '"]').attr('selected', 'selected');
  },

  setEventHandlers: function() {
    $(document).ready(function(){
      $('body').on('click', '.username', app.addFriend);

      $('#send .submit').on('submit', app.handleSubmit);

      $('#roomSelect').on('change', function(event){
        app.currentRoom = $(this).val();
      });

      $('.addRoom form').on('submit', function(event) {
        event.preventDefault();
        app.addRoom($(this).find("#newRoom").val());
      })
    })
  }
};


app.init();
