var Group = require('./group.js');
var Member = require('./member.js');
var globals = require('./globals.js');

module.exports = {
  join: function (user, username, group, socket, io){
    // Check if this is a new user, or is just switching between groups
    if (!user){
      user = new Member(username) // Create the member info with this socket
    } else {
      // Need to unsubscibe user from former group and leave the group
      var oldGroup = globals.allGroups[user.group];
      oldGroup.removeMember(user);
      if(socket && io){
        socket.leave(oldGroup.socketIORoom, function () {
          io.to(user.group).emit('groupChange', {members: oldGroup.members})
        });
      }
    }
    group.addMember(user); // Add this member to the group

    if(socket && io){
      socket.join(group.socketIORoom, function () {
        io.to(group.socketIORoom).emit('groupChange', {members: group.members})
      });
    }

    return user;
  }
}