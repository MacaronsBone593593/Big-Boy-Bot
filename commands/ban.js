const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    let bUser = message.guild.member(message.mentions.users.first() || message.guild.get(args[0]));
    if (!bUser) return message.channel.send("Could not find user!")
    let breason = args.join(" ").slice(22);
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You do not have the permission to use this command");
    if (bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("I cannot ban them.");

    let banEmbed = new Discord.RichEmbed()
        .setTitle("User Banned")
        .setFooter("User Ban Logs")
        .setColor("#ff0000")
        .setTimestamp()
        .addField("Banned User:", `${bUser}, ID: ${bUser.id}`, true)
        .addField("Reason:", breason, true)
        .addField("Moderator:", `${message.author}, ID: ${message.author.id}`, true)
        .addField("Time:", message.createdAt, true)
        .addField("Channel:", message.channel, true)

    let banchannel = message.guild.channels.find(`name`, "bot-log-channel");
    if (!banchannel) return message.channel.send("I can not find a channel to send reports");

    await bUser.send("You have been banned from the Mickey Mouse Clubhouse https://www.youtube.com/watch?v=55-mHgUjZfY");
    bUser.ban(breason);
    message.delete();
    banchannel.send(banEmbed);
    message.channel.send(bUser.tag + " has been exiled from r/DisneyTVA")

}
module.exports.help = {
    name: "ban"
}
