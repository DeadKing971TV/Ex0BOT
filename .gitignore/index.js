const Discord = require("discord.js");
const fs = require('fs')
const client = new Discord.Client();
const ytdl = require('ytdl-core');

let prefix = "?";

const warns = JSON.parse(fs.readFileSync('./warns.json'))

client.on("ready", function() {
    client.user.setActivity("Ex0┃!help", {type:"PLAYING"});
    console.log("Connected")
});

client.login(process.env.TOKEN);

client.on("message", message =>{
    if(message.content === prefix + "fbs"){
        message.reply("Va voir dans les messages épinglés du salon #stats-bot ! :pushpin:");
    }
});

/*Help*/
client.on("message", message =>{
    if(message.content === prefix + "help"){
        message.channel.bulkDelete(parseInt(1))
        let embedon = new Discord.RichEmbed()
            .setTitle("**LES COMMANDES DE __Ex0.exe__ SONT CI DESSOUS !**")
            .setDescription("\n``!kick [Utilisateur]`` - Exclure un utilisateur du serveur.\n``!ban [Utilisateur]`` - Bannir un utilisateur du serveur.\n``!clear [nbr de messages à effacer]`` - Effacer les messages précédents.\n``!mute [Utilisateur]`` - Mute un utilisateur du serveur.\n``!unmute [Utilisateur]`` - Unmute un utilsateur du serveur.\n``!rules`` - Afficher les règles du serveur.\n``!help`` - Afficher les commandes de **Ex0**.\n``!helpme`` - Afficher les commandes pour les membres.\n``!warn [Utilisateur]`` - Mettre un warn à un utilisteur.\n``!unwarn [Utilisateur]`` - Enlever le warn d'un utilisateur.\n``!8ball [Question]`` - Répond à une question par diverses réponses.\n``!2ball [Question]`` - Répond à une question par oui ou non.\n``!invit`` - Génère un lien d'invitation permanant.\n``!avatar`` - Génère l'avatar de son discord.\n\n:wrench: **MERCI DE LES UTILISER CORRECTEMENTS !** :wrench:")
            .setThumbnail("https://www.brandcrowd.com/gallery/brands/pictures/picture15357343836571.jpg")
            .setColor(39423)
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande :angry:")
        message.channel.send(embedon)
    }
});

client.on("message", message =>{
    if(message.content === prefix + "rules"){
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande :angry:")
        message.channel.send("__**Merci, de vous familiariser avec les règles du serveur, les rôles et les salons textuels.**__ @everyone \n\n:one: **Soyez respectueux :** les discussions homophobes, injures désobligeantes, propos racistes, sexistes et pornographiques... sont à proscrire.\n\n:two: **Pas de publicité que ce soit Discord, ou toute autre publicité est interdite de même pour les gains de V-bucks...**\n\n:three: **Pas de spam textuels et vocaux.**\n\n:four: **Respecter le sujet de chaque salon.**\n\n:five: **Vente, Echange et demande de cadeaux interdits.**\n\n:bulb: **MERCI DE RESPECTER CES RÈGLES !** :bulb:");
    }
});

/*A rejoint*/
client.on('guildMemberAdd', member =>{
    member.addRole('591024621139263488')

});

/*A quitté*/
client.on('guildMemberRemove', member =>{
  let embed = new Discord.RichEmbed()
    .setDescription(':cry: **' + member.user.username + '** viens de quitter **' + member.guild.name + '**.')
    .setFooter('Nous sommes désormais ' + member.guild.memberCount + ' sur ce serveur !')
  member.guild.channels.get('').send(embed)

});

/*Kick*/
client.on('message',message =>{
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)
 
  if (args[0].toLocaleLowerCase() === prefix + 'kick'){
       if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas kick cet utilisateur :x:")
       if (!member.kickable) return message.channel.send("Je ne peux pas exclure cet utilisateur :sunglass:")
       member.kick()
       message.channel.send("**"+member.user.username + '** a été exclu :white_check_mark:')
  }
});
 
/*Ban*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'ban'){
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
       if (!member.bannable) return message.channel.send("Je ne peux pas bannire cet utilisateur :sunglass:")
       message.guild.ban(member, {days: 7})
       message.channel.send("**"+ member.user.username + '** a été banni :white_check_mark:')
    }
});

/*Clear and Mute*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !")
        let count = args[1]
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100")
        message.channel.bulkDelete(parseInt(count) + 1)
        message.channel.send("Vous avez effacer ``" + count + "`` messages ! :ballot_box_with_check:")

        message.channel.bulkDelete(parseInt(1))
    }

    if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Membre introuvable")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre")
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas mute ce membre")
        let muterole = message.guild.roles.find('name', "Muted")
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + ' a été mute :white_check_mark:')
            member.createDM().then(channel => {
                return channel.send('Bonjour, **' + member.displayName + '.** Vous avez été mute sur **Ex0duS Team_fr !**');
            })
        }
        else {
            message.guild.createRole({name: 'Muted', permissions: 0}).then((muterole) => {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
                    channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false
                    })
                })
                member.addRole(muterole)
                message.channel.send(member + ' a été mute ! :white_check_mark:')
            })
        }
    }
});

client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
   
    /*unmute*/
    if(args[0].toLowerCase() === prefix + "unmute"){
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        if(!member) return message.channel.send("Membre introuvable")
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre.")
        if(member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas unmute ce membre.")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
        message.channel.send(member + ' a été unmute :white_check_mark:')
        member.createDM().then(channel => {
            return channel.send('Bonjour, **' + member.displayName + '.** Vous avez été unmute ! :white_check_mark:**');
        })
    }
});

/*MsgPrivé*/
client.on('guildMemberAdd', member =>{
    member.createDM().then(channel => {
        return channel.send('Bienvenue **' + member.displayName + '** sur **Fortnite FR Community**, un serveur exclusivement pour la communautée de Fortnite ! Pour y passer du bon temps, merci de suivre les *règles* du serveur. Passe une bonne journée ! :smile:');
    })
});

/*Avatar*/
client.on("message", message => {
    if (message.content === prefix + "avatar") {
        message.channel.bulkDelete(parseInt(1))
        message.reply(message.author.avatarURL);
    }
});

/*Invit*/
client.on("message", message =>{
    if(message.content === prefix + "invit"){
        message.channel.bulkDelete(parseInt(1))
        message.channel.send("https://discord.gg/58rAcaj");
    }
});


/*Warns*/
client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        if (member.highestRole.comparePositionTo(message.member.highestRole) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre")
        let reason = args.slice(2).join(' ')
        if (!reason) return message.channel.send("Veuillez indiquer une raison")
        if (!warns[member.id]) {
            warns[member.id] = []
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
    }
 
    if (args[0].toLowerCase() === prefix + "infractions") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre !")
        if(!warns[member.id]|| !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns !")
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField('10 derniers warns', ((warns[member.id]) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns !"))
            .setTimestamp()
        message.channel.send(embed)
    }
});

/*8ball*/
client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
   
    if (args[0].toLocaleLowerCase() === prefix + '8ball'){
        if (!args[0]) return message.channel.send("Veuillez **poser une question** :x:")
        let rep = ["Non :x:", "J'ai envie de dormir :zzz:", "Balec :face_palm:", "Peut être... :thinking:", "Absolument :interrobang:", "Rein à foutre :shit:", "Tu es moche :nose:", "Répete pour voir ?!", "MDR ! :joy:"];
        let reptaille = Math.floor((Math.random() * rep.length));
        let question = args.slice(0).join(" ");
 
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag)
            .setColor("ORANGE")
            .addField("Question:", question)
            .addField("Réponse:", rep[reptaille]);
        message.channel.send(embed)
    }
});

/*2ball*/
client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
   
    if (args[0].toLocaleLowerCase() === prefix + '2ball'){
        if (!args[0]) return message.channel.send("Veuillez **poser une question** :x:")
        let rep = ["Oui !", "Non !"];
        let reptaille = Math.floor((Math.random() * rep.length));
        let question = args.slice(0).join(" ");
 
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag)
            .setColor("BLUE")
            .addField("Question:", question)
            .addField("Réponse:", rep[reptaille]);
        message.channel.send(embed)
    }
});

/*Unwarn*/
client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if(args[0].toLowerCase() === prefix + "unwarn"){
        let member = message.mentions.members.first()
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ! :angry:")
        if(!member) return message.channel.send("Membre introuvable !")
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.")
        if(member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne pas unwarn ce membre.")
        if(!warns[member.id]|| !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns !")
        warns[member.id].shift()
        fs.writeFileSync('./warns.json',JSON.stringify(warns))
        message.channel.send("Le dernier warn de " +member+ " a été retiré ! :white_check_mark:")
   
    }
});

/*AddRole*/
client.on("message", message => {
    if(message.content === prefix + "xbox") {
        let grocacarole = message.guild.roles.find('name', "XBOX")
        message.channel.bulkDelete(parseInt(1))

        if(message.member.roles.find('name', 'XBOX')) {
            message.member.removeRole(grocacarole)
            message.reply("Vous n'avez plus le rôle **XBOX** :x: !")
        }
        else {
            message.member.addRole(grocacarole)
            message.reply("Vous avez maintenant le rôle **XBOX** :white_check_mark: !")
        }
    }
});


client.on("message", message => {
    if(message.content === prefix + "ps4") {
        let ps4role = message.guild.roles.find('name', "PS4")
        message.channel.bulkDelete(parseInt(1))

        if(message.member.roles.find('name', 'PS4')) {
            message.member.removeRole(ps4role)
            message.reply("Vous n'avez plus le rôle **PS4** :x: !")
        }
        else {
            message.member.addRole(ps4role)
            message.reply("Vous avez maintenant le rôle **PS4** :white_check_mark: !")
        }
    }
});


client.on("message", message => {
    if(message.content === prefix + "pc") {
        let pcrole = message.guild.roles.find('name', "PC")
        message.channel.bulkDelete(parseInt(1))

        if(message.member.roles.find('name', 'PC')) {
            message.member.removeRole(pcrole)
            message.reply("Vous n'avez plus le rôle **PC** :x: !")
        }
        else {
            message.member.addRole(pcrole)
            message.reply("Vous avez maintenant le rôle **PC** :white_check_mark: !")
        }
    }
});


client.on("message", message => {
    if(message.content === prefix + "mobile") {
        let mobilerole = message.guild.roles.find('name', "MOBILE")
        message.channel.bulkDelete(parseInt(1))

        if(message.member.roles.find('name', 'MOBILE')) {
            message.member.removeRole(mobilerole)
            message.reply("Vous n'avez plus le rôle **MOBILE** :x: !")
        }
        else {
            message.member.addRole(mobilerole)
            message.reply("Vous avez maintenant le rôle **MOBILE** :white_check_mark: !")
        }
    }
});


client.on("message", message =>{
    if(message.content === prefix + "helpme"){ 
        message.channel.bulkDelete(parseInt(1))
        let embedoff = new Discord.RichEmbed()
            .setTitle("**MERCI D'AVOIR UTILISER CETTE COMMANDE ! LA LISTE DES COMMANDES SONT CI-DESSOUS :**")
            .setDescription("\n``!2ball [question]`` - Répond à une question par oui ou non.\n``!8ball [question]`` - Répond à une question par diverses réponses.\n``!invit`` - Génère un lien d'invitation permanant.\n``!avatar`` - Génère l'avatar de son discord.\n``!fbs`` - Afficher les commandes du bot fortnite.\n``!helpme`` - Afficher les commandes.\n\n**MERCI DE LES UTILISER CORRECTEMENTS !**")
            .setColor(39423)
            .setThumbnail("https://www.brandcrowd.com/gallery/brands/pictures/picture15357343836571.jpg")
        message.channel.send(embedoff)
    }
});


client.on("message", message =>{
    if(message.content === prefix + "rolehelp"){
        message.channel.bulkDelete(parseInt(1))
        let embedon = new Discord.RichEmbed()
            .setTitle("**LES COMMANDES POUR OBTENIR LES RÔLES SONT CI DESSOUS !**")
            .setDescription("``!xbox`` - Pour obtenir le rôle des joueurs Xbox.\n``!ps4`` - Pour obtenir le rôle des joueurs PS4.\n``!pc`` - Pour obtenir le rôle des joueurs PC.\n``!mobile`` - Pour obtenir le rôle des joueurs mobiles.\n\n**MERCI DE LES UTILISER CORRECTEMENT !**")
            .setThumbnail("https://www.brandcrowd.com/gallery/brands/pictures/picture15357343836571.jpg")
            .setColor(39423)
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande :angry:")
        message.channel.send(embedon)
    }
});


