var globals = require('./globals.js')

function Group(name, idNum, maxNumMembers){
  this.name = name;
  this.id = idNum;
  this.socketIORoom = name;
  this.maxNumMembers = maxNumMembers || 10;
  this.owner = null;

  this.members = [];
  this.musicQueue = [];
  this.songsPlayed = [];

  // member: a member object
  // This also removes a member from any previous groups
  this.addMember = function (member) {
    this.members.push(member);
    var oldGroup = member.group;  // If they have a group already, remove them from it
    if (oldGroup) {
      globals.allGroups[oldGroup].removeMember(member);
    }
    member.group = this.name;
  };

  // member: a member object
  this.removeMember = function (member) {
    for (var i = 0; i < this.members.length; i++){
      if (this.members[i].name = member.name) {
        this.members.splice(i, 1);
        member.group == null;
        break;
      }
    }
  };

}


module.exports = Group;
