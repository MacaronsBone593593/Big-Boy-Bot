const Discord = require("discord.js"); // Discord Module Required
module.exports.run = async (client, message, args) => { // if your cmd handler has different things than client, message etc change it

  let logs = message.guild.channels.find("name", "bot-log-channel");
  if(!logs) return message.channel.send("Could not find a logs channel.");

  let user = message.mentions.users.first();
  if(!user) return message.reply("Please mention a user");

  let reason = args.join(" ");
  if(!reason) reason = "No reason given";
  if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You do not have the perms to execute this command.");
  if (user.hasPermission("BAN_MEMBERS")) return message.channel.send("Hmm ... I can not ban them");

  message.guild.member(user).ban(reason);

  let logsEmbed = new Discord.RichEmbed() // Master is MessageEmbed
  .setTitle("User Banned")
  .setFooter("User Ban Logs")
  .setColor("#ff0000")
  .setTimestamp()
  .addField("Banned User:", `${user}, ID: ${user.id}`, true)
  .addField("Reason:", reason, true)
  .addField("Banned by:", `${message.author}, ID: ${message.author.id}`, true)
  .addField("Time:", message.createdAt, true)
  .addField("Channel:", message.channel, true)

  logs.send(logsEmbed);
  message.channel.send(logsEmbed)
}
module.exports.help = {
  name: "ban"
};
