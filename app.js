const moment = require('moment')
const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require('ytdl-core');
const request = require('request');
const getYoutubeID = require('get-youtube-id');
const youtubeInfo = require('youtube-info');
const talkedRecently = new Set();
const ms = require("ms");
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();
const prefix = "-";;
const dotenv = require('dotenv');
dotenv.load();

const botToken = process.env.BOT_TOKEN;
const youtubeAPIKey = process.env.YOUTUBE_API_KEY;

let guilds = {};


client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setStatus('available')
    client.user.setActivity(`with Goofy | -help`, {type: "PLAYING"});
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setStatus('available')
    client.user.setActivity(`with Goofy | -help`, {type: "PLAYING"});
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setStatus('available')
    client.user.setActivity(`with Goofy | -help`, {type: "PLAYING"});
});
let money = JSON.parse(fs.readFileSync("./money.json", "utf8"));

client.on('message', message => {
	if (!message.content.startsWith(prefix)) return;
	if(message.author.bot) return;
	if (!message.guild) return;

	const args = message.content.slice(1).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();

	if (command === "help") {
		message.delete(0);
		const workembed = new Discord.RichEmbed()
		.setTitle("Command List")
	    .setColor("RANDOM")
      .setThumbnail("https://vignette.wikia.nocookie.net/fantendo/images/b/ba/Mickey_mouse_png_by_matteoprincipe-d5hnsrl.png/revision/latest?cb=20150606145821")
	    .addField("-help", "Show the list of commands.", false)
	    .addField("-money | -balance | -bal", "Show your current account balance.", false)
	    .addField("-work", "Go to work to earn some money.", false)
	    .addField("-titles", "Show the list of titles and thier prices.", false)
	    .addField("-buy <title>", "Buy prestigious Titles for your money.", false)
      .addField("-avatar <@username#1234>", "Get yours/users avatar.", false)
      .addField("-report <@username#1234> <reason>", "Report a user to the staff for breaking rules.", false)
      .addField("-suggest <@yourusername#1234> <suggestion>", "Send a suggestion to the staff.", false)
      .addField("-userinfo/uinfo <@username#1234>", "Get Information on yourself or of another user.", false)
      .addField("Music commands", "-play <song name/link>,-skip, -queue, -stop", false)


	    message.channel.send(workembed);
	}
  if (command === "avatar"){
  let member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.author;
  let embed = new Discord.RichEmbed()
	        .setTitle(member.tag + '\' avatar')
          .setColor("RANDOM")
	        .setImage(member.avatarURL);
  message.channel.send({embed})
}

  if (command === "report"){
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user.");
    if(!args[0] || args[0 == "help"]) return message.reply("Usage : &report <user> <reason>");
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#15f153")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", rreason);

    let reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("Couldn't find reports channel.");


    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);

  }

  if (command === "suggest"){
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user.");
    if(!args[0] || args[0 == "help"]) return message.reply("Usage : -suggest <suggestion>");
    let rreason = args.join(" ").slice(22);

    let suggestEmbed = new Discord.RichEmbed()
    .setDescription("Suggestion")
    .setColor("#15f153")
    .addField("Suggested By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Suggestion", rreason);

    let suggestchannel = message.guild.channels.find(`name`, "suggestions");
    if(!suggestchannel) return message.channel.send("Couldn't find suggestions channel.");


    message.delete().catch(O_o=>{});
    suggestchannel.send(suggestEmbed);
    message.channel.send("Suggestion has been sent!")

  }



  if (command === "uptime"){
        var hours = (Math.round(client.uptime / (1000 * 60 * 60)));
        var days = (Math.floor(hours / 24));
        var finHours = (hours - days * 24);
        var minutes = (Math.round(client.uptime / (1000 * 60)) % 60);
        var seconds = (Math.round(client.uptime / 1000) % 60);
        message.channel.send(`I have been online for **${days}** days, **${finHours}** hours, **${minutes}** minutes, and **${seconds}** seconds!`);
  }


  if (command === "userinfo" || command === "uinfo"){
    let user;
    	// If the user mentions someone, display their stats. If they just run userinfo without mentions, it will show their own stats.
        if (message.mentions.users.first()) {
          user = message.mentions.users.first();
        } else {
            user = message.author;
        }
    	// Define the member of a guild.
        const member = message.guild.member(user);

    let eicon = message.author.displayAvatarURL;
    let userEmbed = new Discord.RichEmbed()
    .setDescription("User Information")
    .setColor('RANDOM')
    .setThumbnail(user.avatarURL)
    .setTitle(`${user.username}#${user.discriminator}`)
    .addField("ID:", `${user.id}`, true)
    .addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
  	.addField("Created At:", `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
    .addField("Joined Server:", `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
    .addField("Bot:", `${user.bot}`, true)
  	.addField("Status:", `${user.presence.status}`, true)
  	.addField("Game:", `${user.presence.game ? user.presence.game.name : 'None'}`, true)
    .addField("Roles:", member.roles.map(roles => `${roles.name}`).join(', '), true)
  	.setFooter(`Replying to ${message.author.username}#${message.author.discriminator}`)

    message.channel.send(userEmbed);
  }

  if (command === "botinfo"){
    let bicon = client.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setTitle("Mickey")
    .setDescription("Made and maintained by abloane#9965")
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("Bot Name", client.user.username)
    .addField("Created On", client.user.createdAt);

    message.channel.send(botembed);
  }
	});

const credentials = require("./credentials");


client.muted = require("./muted.json");

fs.readdir("./commands/", (err, files) => {
    // Check if folder exist if not err
    if(err) console.error(err);

    // Filter only JavaScript Files
    let jsFiles = files.filter(f => f.split(".").pop() === "js");

    // Verify if there are JavaScript command files there
    if(jsFiles.length <= 0) {
        console.log("No command files found!");
        return;
    }

    // Tell user how many command/'s files have been loaded and then list each one
    console.log(`Loading ${jsFiles.length} command/'s!`);

    jsFiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        client.commands.set(props.help.name, props);
    });
})

client.on("ready", async () => {
    console.log(`${client.user.username} is ready!`);

    // Every 5 seconds check the "muted.json" file to see when a users mute is up
    client.setInterval(() => {
        for(let i in client.muted) {
            let time = client.muted[i].time;
            let guildId = client.muted[i].guild;
            let guild = client.guilds.get(guildId);
            let member = guild.members.get(i);
            let mutedRole = guild.roles.find(mR => mR.name === "Muted");
            if(!mutedRole) continue;

            if(Date.now() > time) {
                member.removeRole(mutedRole);
                delete client.muted[i];

                fs.writeFile("./muted.json", JSON.stringify(client.muted), err => {
                    if(err) throw err;
                });
            }
        }
    }, 5000);
});

client.on("message", async message => {
    // Validate that the user can only message the bot within a channel on the server
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);
    let author = message.author
    let guild = message.guild

    if(!command.startsWith(prefix)) return;

    let cmd = client.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(client, message, args, author, guild, command, messageArray);

});

client.on('message', message => {
	if (message.channel.type == "dm") return console.log("User tried to insult me in DM's");
    const swearWords = ["nigga","nigger","faggot","cracker","dyke","hail hitler","cunt","queer","spick","jigaboo","chink","ching chong","chingchong"," hitler is the best","wop","fag"];
    if (swearWords.some(word => message.content.includes(word))) {
        message.delete();
        message.channel.send(`Hey ${message.author}! That word has been banned, please don't use it!`).then(m => m.delete(10000)); // This function will tell the user off for using the filtered words, and then the message which telsl the user off will be deleted after 3 seconds. If you would like to extend the time, feel free to change it but take note that it's measured in milliseconds. If you don't want the bot to remove the warning message, take off the ".then(m => m.delete(3000))" bit!
        embed = new Discord.RichEmbed() // The log feature will log embeds, instead of simple messages. This improves the look of the word filter and makes it easier to code.
        embed.setAuthor(name=`${message.author.tag}`, icon=message.author.avatarURL) // The author label will show the user who actually used the word. It will show their FULL tag and their profile picture.
        embed.setDescription('Offensive or curse word found in message, in '+ message.channel) // This will tell you which channel the word was used in.
        embed.setColor("RANDOM") // This is just a random colour. If you'd like to change it, simple change the "ff0000" to a different code. Make sure "0x" stays before the number.
        embed.addField(name="Message:", value=message.content) // This will tell you the entire message, so you can spot out the word which was used.
        embed.setFooter(name=`ID: ${message.author.id}`) // This will give you the UserID of the user who used a filtered word in the embed's footer.
        embed.setTimestamp() // This will tell you what time the word was used at.

        guild = client.guilds.get("483685867630624774")
        channel = guild.channels.find("id", "509080218825130004") // This will find the channel which it will send the log embed into.
        channel.send(embed)
      }
}); // end of function


client.on('ready', function () {
  console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
  clientUser = client.user;
});

client.on('message', function (message) {
  const member = message.member;
  const msg = message.content.toLowerCase();
  const args = message.content.split(' ').slice(1).join(' ');

  if (!guilds[message.guild.id]) {
    guilds[message.guild.id] = {
      queue: [],
      queueNames: [],
      isPlaying: false,
      dispatcher: null,
      voiceChannel: null,
      skipReq: 0,
      skippers: [],
    };
  }

  if (message.author.equals(client.user) || message.author.bot) return;

  if (msg.startsWith(prefix + 'play')) {
    if (member.voiceChannel || guilds[message.guild.id].voiceChannel != null) {
      if (guilds[message.guild.id].queue.length > 0 || guilds[message.guild.id].isPlaying) {
        getID(args, function (id) {
          addToQueue(id, message);
          youtubeInfo(id, function (err, videoinfo) {
            if (err) {
              throw new Error(err);
            }

            guilds[message.guild.id].queueNames.push(videoinfo.title);
            message.reply('the song: **' + videoinfo.title + '** has been added to the queue.');
          });
        });
      } else {
        guilds[message.guild.id].isPlaying = true;
        getID(args, function (id) {
          guilds[message.guild.id].queue.push(id);
          playMusic(id, message);
          youtubeInfo(id, function (err, videoinfo) {
            if (err) {
              throw new Error(err);
            }

            guilds[message.guild.id].queueNames.push(videoinfo.title);
            message.reply('the song: **' + videoinfo.title + '** is now playing!');
          });
        });
      }
    } else if (member.voiceChannel === false) {
      message.reply('you have to be in a voice channel to play music!');
    } else {
      message.reply('you have to be in a voice channel to play music!');
    }
  } else if (msg.startsWith(prefix + 'skip')) {
    if (guilds[message.guild.id].skippers.indexOf(message.author.id) === -1) {
      guilds[message.guild.id].skippers.push(message.author.id);
      guilds[message.guild.id].skipReq++;
      if (guilds[message.guild.id].skipReq >=
      Math.ceil((guilds[message.guild.id].voiceChannel.members.size - 1) / 2)) {
        skipMusic(message);
        message.reply('your skip request has been accepted. The current song will be skipped!');
      } else {
        message.reply('your skip request has been accepted. You need **' +
        (Math.ceil((guilds[message.guild.id].voiceChannel.members.size - 1) / 2) -
        guilds[message.guild.id].skipReq) + '** more skip request(s)!');
      }
    } else {
      message.reply('you already submitted a skip request.');
    }
  } else if (msg.startsWith(prefix + 'queue')) {
    var codeblock = '```';
    for (let i = 0; i < guilds[message.guild.id].queueNames.length; i++) {
      let temp = (i + 1) + '. ' + guilds[message.guild.id].queueNames[i] +
      (i === 0 ? ' **(Current Song)**' : '') + '\n';
      if ((codeblock + temp).length <= 2000 - 3) {
        codeblock += temp;
      } else {
        codeblock += '```';
        message.channel.send(codeblock);
        codeblock = '```';
      }
    }

    codeblock += '```';
    message.channel.send(codeblock);
  } else if (msg.startsWith(prefix + 'stop')) {
    if (guilds[message.guild.id].isPlaying === false) {
      message.reply('no music is playing!');
    }

    message.reply('stopping the music...');

    guilds[message.guild.id].queue = [];
    guilds[message.guild.id].queueNames = [];
    guilds[message.guild.id].isPlaying = false;
    guilds[message.guild.id].dispatcher.end();
    guilds[message.guild.id].voiceChannel.leave();
  }
});

function isYoutube(str) {
  return str.toLowerCase().indexOf('youtube.com') > -1;
}

function searchVideo(query, callback) {
  request('https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=' +
  encodeURIComponent(query) + '&key=' + youtubeAPIKey,
  function (error, response, body) {
    var json = JSON.parse(body);
    if (!json.items[0]) {
      callback('5FjWe31S_0g');
    } else {
      callback(json.items[0].id.videoId);
    }
  });
}

function getID(str, callback) {
  if (isYoutube(str)) {
    callback(getYoutubeID(str));
  } else {
    searchVideo(str, function (id) {
      callback(id);
    });
  }
}

function addToQueue(strID, message) {
  if (isYoutube(strID)) {
    guilds[message.guild.id].queue.push(getYoutubeID(strID));
  } else {
    guilds[message.guild.id].queue.push(strID);
  }
}

function playMusic(id, message) {
  guilds[message.guild.id].voiceChannel = message.member.voiceChannel;

  guilds[message.guild.id].voiceChannel.join().then(function (connection) {
    stream = ytdl('https://www.youtube.com/watch?v=' + id, {
      filter: 'audioonly',
    });
    guilds[message.guild.id].skipReq = 0;
    guilds[message.guild.id].skippers = [];

    guilds[message.guild.id].dispatcher = connection.playStream(stream);
    guilds[message.guild.id].dispatcher.on('end', function () {
      guilds[message.guild.id].skipReq = 0;
      guilds[message.guild.id].skippers = [];
      guilds[message.guild.id].queue.shift();
      guilds[message.guild.id].queueNames.shift();
      if (guilds[message.guild.id].queue.length === 0) {
        guilds[message.guild.id].queue = [];
        guilds[message.guild.id].queueNames = [];
        guilds[message.guild.id].isPlaying = false;
      } else {
        setTimeout(function () {
          playMusic(guilds[message.guild.id].queue[0], message);
        }, 500);
      }
    });
  });
}

function skipMusic(message) {
  guilds[message.guild.id].dispatcher.end();
}


client.login(botToken);
