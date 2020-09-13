const Discord = require('discord.js');
const secrets = require('./secrets.js');
const AWSResources = require('./aws_connection.js');
const ArgParse = require('./helper_funcs/arg_parse.js');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const commandset = require(`./commands/${file}`);
	for (const command of commandset.commands) {
		client.commands.set(command.name, command);
	}
}

client.on('message', message => {
	if (!message.content.startsWith("!") || message.author.bot) {
		return;
	}

	const unparsed_args = message.content.slice(1).trim().split(' ');
	const command = unparsed_args.shift();
	const args = ArgParse(unparsed_args);

	if (!client.commands.has(command)){
		return;
	}

	try {
		client.commands.get(command).execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('There was an error executing that command:', error.name);
	}
})

client.on('ready', () => {
	console.log("Ready!");
})

client.login(secrets['discord_key']);
