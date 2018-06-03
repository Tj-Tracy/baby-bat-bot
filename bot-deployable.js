"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _discord = require("discord.js");

var _discord2 = _interopRequireDefault(_discord);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_dotenv2.default.config();
var bot = new _discord2.default.Client();

bot.on("ready", function () {
  console.log("Logged in as " + bot.user.tag + "!");
});

bot.on("message", function (message) {
  // we dont want to parse messages from the bot itself
  if (message.author.bot) return;

  //break up the message into pieces
  var args = message.toString().split(" ");
  var command = args.shift().toLowerCase();

  var noSpace = message.toString().toLowerCase().replace(/\s/g, '');
  console.log(noSpace);
  if (noSpace.includes('fortnite') || noSpace.includes('fortnight')) {
    message.delete(); //Supposed to delete message
    message.channel.send("Miss me with that normie shit.");
  }

  //check if the first character is a !
  if (command[0] === "!") {
    switch (command) {

      /************************************************************************************************/
      //command to allow people to add their friend to use the server
      case "!friendo":
        //check to make sure the user has friendo or admin permissions
        if (!message.member.roles.some(function (r) {
          return ["friendo", "guy", "boy toy", "pussygrabber"].includes(r.name);
        })) {
          message.channel.send("You do not have permission to use this command.");
          return;
        }
        if (!args[0]) {
          message.channel.send("You need to @ someone to add them to the friendo role");
          return;
        }

        //remove all the characters from the user ID
        var userID = args[0].replace(/[^0-9]/g, "");
        //find the user in the mentions
        var user = message.mentions.members.find("id", userID);
        //add the role
        user.addRole(process.env.FRIENDO_ID).then(function (res) {
          message.channel.send("User " + user.user.username + " is now a friendo of the server ;)");
        }).catch(function (err) {
          message.channel.send("Something went wrong on discords end, " + user.user.username + " could not be made a friendo, try again later.");
        });
        return;
      /************************************************************************************************/
      /************************************************************************************************/
      //stream data command for users
      case "!setstream":
        //if there is no stream url afterwards we can't do anything
        if (!args[0]) {
          message.channel.send("please add your stream url so I can put you on the list");
          return;
        }
        //if they don't have proper roles, they can't do it either
        if (!message.member.roles.some(function (r) {
          return ["friendo", "guy", "boy toy", "pussygrabber"].includes(r.name);
        })) {
          message.channel.send("You aren't allowed to spam my chat with stream advertisements");
          return;
        }

        //otherwise, build the object to be written into the stream
        var streamer = {
          id: message.author.id,
          streamURL: args[0]
        };
        var streamerUrls = void 0;
        _fs2.default.readFile('./streamUrls.json', function (err, data) {
          if (err) {
            console.log(err);
            message.channel.send("Can't find the file with all the stream urls in it. Complain to TJ and his shit coding about it.");
            return;
          }
          streamerUrls = JSON.parse(data.toString());
          streamerUrls = _extends({}, streamerUrls, _defineProperty({}, streamer.id, streamer));
          console.log(streamerUrls);
          _fs2.default.writeFile('./streamUrls.json', JSON.stringify(streamerUrls), function (err) {
            if (err) {
              console.log(err);
              message.channel.send("I couldn't write you onto the list of streamers for some reason. try again later.");
            } else {
              message.channel.send("MAKE SURE YOUR URL IS THE EXACT LINK. if you did that, you are all set. use !stream to link your stream in chat.");
            }
          });
        });

        return;
      /************************************************************************************************/
      /************************************************************************************************/
      case "!stream":
        //if they don't have permission, they cant use this command
        if (!message.member.roles.some(function (r) {
          return ["friendo", "guy", "boy toy", "pussygrabber"].includes(r.name);
        })) {
          message.channel.send("You're no streamer of mine.");
          return;
        }

        //read the file to find the streamer
        _fs2.default.readFile('./streamUrls.json', function (err, data) {
          if (err) {
            console.log(err);
            message.channel.send("Can't find the file with all the stream urls in it. Complain to TJ and his shit coding about it.");
            return;
          }
          streamerUrls = JSON.parse(data.toString());
          if (streamerUrls[message.author.id]) {
            message.channel.send("watch live at: " + streamerUrls[message.author.id].streamURL);
          } else {
            message.channel.send("you have to set your url with !setstream first");
          }
        });
        return;

      /************************************************************************************************/
      //hereboy command that everyone wanted for some reason
      case "!hereboy":
        message.channel.send("<:pupper:420995886722711553>");
        return;
      /************************************************************************************************/

      /************************************************************************************************/
      //the no command message
      default:
        message.channel.send("I didn't understand that");
        return;
      /************************************************************************************************/
    }
  }
  return;
});

//connect the bot
bot.login(process.env.AUTH_TOKEN);
