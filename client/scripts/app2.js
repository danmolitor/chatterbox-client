

var app = { };
var messageIds = [];
app.friends=[];
app.room = 'lobby';

function showMessages(results) {
	_.each(results,function(message){
		var textOrMessage = message.text || message.message;
		var userCheck = message.username || "anonymous";
		var createdAt = message.createdAt.split("").slice(11,19).join("");

		if (messageIds.indexOf(message.objectId) === -1){
		var $msg = $("<h4>")
			.text( userCheck + " @ " + createdAt + " : " + textOrMessage )
			.css({ "margin" : "10px"})

		var $userTag = $('<br/><a "userName">---'+userCheck+'</a>')
				.attr("class", userCheck)
				.appendTo($msg)	
				.css({ "color":"blue"})
		if(app.friends.indexOf(userCheck) !== -1 ){
			$userTag.css({"color":"red"})
		}
				
		$($userTag).on("click", function(){
			if(app.friends.indexOf(userCheck) === -1){
				app.friends.push(userCheck);
			}			
		})	


		var $container = $("<div>")
			.attr("class",".messages")
			.css({ 
				'background-color' : '#e5f2ff',
				"margin" : "10px",
				// "border" : "black solid 1px",
				"border-radius" : "5px"
			 })
			.prependTo(".beginning")
			.append($msg)
			messageIds.push(message.objectId);
		}
	})
};

app.fetch = function(){
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'GET',
		data: {order : "-createdAt" },
		contentType: 'application/json',
		success: function(data) {
			console.log(' 2 - Data Received: ', data);
			showMessages(data.results);
			//process room data
			app.populateRooms(data.results);
			messages = data;
		},
		error: function(data) {
			console.error('chatterbox: Failed to send message. Error: ', data);
		}
	});
	setTimeout(app.fetch, 5000);
}

app.post = function(message){
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
			success: function (data) {
			console.log('chatterbox: Message sent. Data: ', data);
		},
		error: function (data) {
			console.error('chatterbox: Failed to send message. Error: ', data);
		}
	});
};
function init(){
	$("#sendMessage").on("click",function(){
		var message = {
			username: window.location.search.split("").slice(10,19).join(""),
			text: $(".userInput").val(),
			roomname: '...'
		};
		// console.log(message);
		app.post(message);
	});
	app.fetch();
	var $placeHolder = $("<div>")
		.attr("class","beginning")
		.appendTo("#main")
		.append($placeHolder);
	app.$roomSelect = $('#roomSelect')
}

    app.populateRooms = function(results) {
      app.$roomSelect.html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option></select>');

      if (results) {
        var rooms = {};
        results.forEach(function(data) {
          var roomname = data.roomname;
          if (roomname && !rooms[roomname]) {
            // Add the room to the select menu
            app.addRoom(roomname);

            // Store that we've added this room already
            rooms[roomname] = true;
          }
        });
      }

      // Select the menu option
      app.$roomSelect.val(app.roomname);
    }

    app.addRoom = function(roomname) {
      // Prevent XSS by escaping with DOM methods
      var $option = $('<option/>').val(roomname).text(roomname);

      // Add to select
      app.$roomSelect.append($option);
    }

    app.saveRoom = function(evt) {

      var selectIndex = app.$roomSelect.prop('selectedIndex');
      // New room is always the first option
      if (selectIndex === 0) {
        var roomname = prompt('Enter room name');
        if (roomname) {
          // Set as the current room
          app.roomname = roomname;

          // Add the room to the menu
          app.addRoom(roomname);

          // Select the menu option
          app.$roomSelect.val(roomname);

          // Fetch messages again
          app.fetch();
        }
      }
      else {
        // Store as undefined for empty names
        app.roomname = app.$roomSelect.val();

        // Fetch messages again
        app.fetch();
      }
    }

$(document).ready(function(){
	init();
})