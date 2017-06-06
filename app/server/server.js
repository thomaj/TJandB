const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const port = process.env.PORT || 3000;
var path = require('path');

var Group = require('./group.js');
var Member = require('./member.js');
var globals = require('./globals.js');
var actions = require('./actions.js');
var api = require('./api');


// Routing
app.use(express.static(__dirname + '/../'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../public/index.html'));
})

// Locatino to Handle api request
app.use('/api', api)

globals.allGroups['first group'] = new Group('first group', globals.ids++);


// ----------------------------- Socket.io operations ------------------------------ //
var updateSocket = function (socket, user, group) {
  socket.memberInfo = user;
  socket.join(group.socketIORoom);
  io.to(socket.id).emit('successful join', {user: user, group: group});
}


// When a client opens a connection to the application
io.on('connection', function (socket){
  console.log("New client: " + socket.id);

  // When new client joins a group
  socket.on('join group', function (data){
    var selectedGroup = data.groupName;
    var username = data.username || socket.memberInfo.name;
    var group = globals.allGroups[selectedGroup];

    if (selectedGroup && group && group[username] == null){
      var user = actions.join(socket.memberInfo, username, group, socket, io);
      updateSocket(socket, user, group);
      console.log('Created user: ' + socket.memberInfo);
      socket.to(group.socketIORoom).emit('group update', {group: group})
    } else {
      console.log('The group "' + data.groupName +'" does not exist or the username "' + data.username + '" has been taken');
      // Let them know something has happened
      socket.broadcast.to(socket.id).emit('join group error', 'The username has already been taken');
    }

  });

// A client should only switch and join between groups
  // // When a client leaves a group
  // socket.on('leave', function (data){

  // });

  // When a client creates a group
  // This will also put the user in this group
  socket.on('create group', function (data){
    var groupName = data.groupName || globals.ids;
    var username = data.username;

    if(globals.allGroups[groupName] == null) {
      // No group with this name yet, so can make it
      var newGroup = new Group(groupName, globals.ids++, data.maxNumMembers);
      globals.allGroups[groupName] = newGroup;
      // Add this user to the group as well
      var user = actions.join(socket.memberInfo, username, newGroup, socket, io);
      updateSocket(socket, user, newGroup);

    } else {
      console.log('Attempted to create group which already existed');
      // Let them know something has happened
      socket.broadcast.to(socket.id).emit('create group error', 'Group already exists');
    }

  });

  // When a client wants to delete a group
  // Can only delete if this if the correct password is given
  socket.on('delete group', function (data) {
    var groupToDelete = data.groupName;
    var password = data.password;

    var group = globals.allGroups[groupToDelete];
    if(group && password === globals.password) {
      // Remove all the members from the list
      _.each(group.members, function (mem) {
        group.removeMember(mem);
      })
      // Now let these users know they do not have a group and delete the group fully
      socket.broadcast.to(group.socketIORoom).emit('group deleted');
      delete globals.allGroups[groupToDelete];
    } else {
      console.log('Group not deleted')
      if (!group) console.log('Group also did not exist');
    }

  })

// Just use the join listener
/*
  // When a client wants to switch groups
  socket.on('switch group', function (data){
    var newGroupName = data.groupName;
    if (!socket.memberInfo) {
      console.log('ERROR: attempting to switch a member that does not exist');
      return;
    }
    var group = globals.allGroups[newGroupName]
    if(group) {
      group.addMember(socket.memberInfo);
    }
  });
*/


  // For a user leaving the application
  // Remove them from their group
  socket.on('disconnect', function (data) {
    console.log('Client with id: ' + socket.id + ' is disconnecting');
    if(socket.memberInfo) {
      var mem = socket.memberInfo;
      var group = globals.allGroups[mem.group]
      if(group){
        group.removeMember(socket.memberInfo);
      }
    }
  });

});




server.listen(port, function (){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at port ' + port + '...');
});