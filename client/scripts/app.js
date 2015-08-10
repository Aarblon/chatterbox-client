// YOUR CODE HERE:

var app = {
  init: function(){
    //Setting up click handler to trigger addFriend when username clicked
   $(document).ready(function(){
     $('body').on('click', '.username', function(){
       app.addFriend();
     });
     $('#send .submit').on('submit',
       app.handleSubmit
     );
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
        console.log('chatterbox: Message sent');
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
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
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
    //check to see if room exists
    // if($("#chats").find('#'+ message.roomname).length === 0 ) {
    //   $('#chats').append('<div id='+ message.roomname + '></div>'));
    // }

    // $('#' + message.roomname).append()

    $('#chats').append('<div class="chatLine">' +
                         '<span class="username">' + message.username + ': </span>' +
                         '<span class="messageText">' + message.text + '</span>' +
                       '</div>');
  },
  addRoom: function(roomName){
    $('#roomSelect').append('<div id="' + roomName + '">' + roomName + '</div>');
  },
  addFriend: function(){

  },
  handleSubmit: function(){
    console.log("triggered");
  }
};


app.init();





