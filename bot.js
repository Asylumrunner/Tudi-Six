const Discord = require('discord.js');
const secrets = require('./secrets');
const AWS = require('aws-sdk');
AWS.config.update({'region': 'us-east-1'})
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on("message", message => {

})

client.login(secrets['discord_key']);
