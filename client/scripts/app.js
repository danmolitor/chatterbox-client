// YOUR CODE HERE:
var messages
function log(obj){
  console.log("3 - Log: ", obj);
  // Do Stuff
};
$(document).ready(
  console.log("1 - Document Ready ");
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: JSON.stringify(),
    contentType: 'application/json',
    success: function (data) {
      console.log(' 2 - Data Received: ', data);
      log(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message. Error: ', data);
    }
  });
)

