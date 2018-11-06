const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if(message.author.id !== "175078304632668161") return message.channel.send("You cannot use this command because, you are not a developer.")


  rebootclient(message.channel);
       function rebootclient(channel) {
           message.react('✅')
               .then(message => client.destroy())
               .then(message => client.destroy())
              .then(() => client.login("NTA4NTUyMjI3NzAzNzUwNjc3.DsA8Aw.awxH1nTcF8oEh6_ibuHT0-MOo9s"));
           message.channel.send("``[Mickey] has successfully rebooted!``")
       }
    }
    exports.help = {
      name: "reboot"
    };
