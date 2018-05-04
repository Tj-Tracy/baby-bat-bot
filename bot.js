import dotenv from "dotenv";
import discord from "discord.js";
import fs from "fs";

dotenv.config();
const bot = new discord.Client();

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", message => {
  // we dont want to parse messages from the bot itself
  if (message.author.bot) return;

  if (message.content.includes('fortnite')) {
    message.delete(); //Supposed to delete message
    message.channel.send("Miss me with that normie shit.");

  }

  //break up the message into pieces
  const args = message.toString().split(" ");
  const command = args.shift().toLowerCase();

  //check if the first character is a !
  if (command[0] === "!") {
    switch (command) {

      /************************************************************************************************/
      //command to allow people to add their friend to use the server
      case "!friendo":
        //check to make sure the user has friendo or admin permissions
        if (!message.member.roles.some(r => ["friendo", "guy", "boy toy", "pussygrabber"].includes(r.name))) {
          message.channel.send(
            "You do not have permission to use this command."
          );
          return;
        }
        if (!args[0]) {
          message.channel.send(
            "You need to @ someone to add them to the friendo role"
          );
          return;
        }

        //remove all the characters from the user ID
        let userID = args[0].replace(/[^0-9]/g, "");
        //find the user in the mentions
        let user = message.mentions.members.find("id", userID);
        //add the role
        user
          .addRole(process.env.FRIENDO_ID)
          .then(res => {
            message.channel.send(
              `User ${user.user.username} is now a friendo of the server ;)`
            );
          })
          .catch(err => {
            message.channel.send(
              `Something went wrong on discords end, ${
                user.user.username
              } could not be made a friendo, try again later.`
            );
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
        if (!message.member.roles.some(r => ["friendo", "guy", "boy toy", "pussygrabber"].includes(r.name))) {
          message.channel.send("You aren't allowed to spam my chat with stream advertisements");
          return;
        }

        //otherwise, build the object to be written into the stream
        let streamer = {
          id: message.author.id,
          streamURL: args[0]
        }
        let streamerUrls;
        fs.readFile('./streamUrls.json', (err, data) => {
          if(err) {
            console.log(err);
            message.channel.send("Can't find the file with all the stream urls in it. Complain to TJ and his shit coding about it.");
            return;
          }
          streamerUrls = JSON.parse(data.toString());
          streamerUrls = {
            ...streamerUrls,
            [streamer.id]: streamer
          }
          console.log(streamerUrls);
          fs.writeFile('./streamUrls.json', JSON.stringify(streamerUrls), (err) => {
            if(err) {
              console.log(err);
              message.channel.send("I couldn't write you onto the list of streamers for some reason. try again later.");
            } else {
              message.channel.send("MAKE SURE YOUR URL IS THE EXACT LINK. if you did that, you are all set. use !stream to link your stream in chat.");
            }
          })
        });

        return;
      /************************************************************************************************/
      /************************************************************************************************/
      case "!stream":
        //if they don't have permission, they cant use this command
        if (!message.member.roles.some(r => ["friendo", "guy", "boy toy", "pussygrabber"].includes(r.name))) {
          message.channel.send("You're no streamer of mine.");
          return;
        }

        //read the file to find the streamer
        fs.readFile('./streamUrls.json', (err, data) => {
          if(err) {
            console.log(err);
            message.channel.send("Can't find the file with all the stream urls in it. Complain to TJ and his shit coding about it.");
            return;
          }
          streamerUrls = JSON.parse(data.toString());
          if(streamerUrls[message.author.id]) {
            message.channel.send(`watch live at: ${streamerUrls[message.author.id].streamURL}`);
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


