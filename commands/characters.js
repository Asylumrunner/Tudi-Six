const AWSResources = require('../aws_connection.js');
const { TokenFileWebIdentityCredentials } = require('aws-sdk');

async function SearchForCharacter(author, guild) {
    var params = {
        TableName: 'Tudi_Six_Characters',
        Key: {
            'char_id': {'S': author+'000'+guild}
        }
    }

    try {
        var result = await AWSResources.dynamodb.getItem(params).promise();
        return result.Item;
    }
    catch (err){
        console.log(err);
        return {};
    }
    
}

module.exports = {
    commands: [
        {
            name: 'createchar',
            description: 'Creates a character, associating it with the player and server',
            execute(message, args) {
                var author = message.author.id;
                var guild = message.guild.id;
                SearchForCharacter(author, guild).then(result => {
                    if ('char_id' in result) {
                        message.channel.send("```Error: You already have a character. Maximum one character per player per server. Please use editcharacter instead```");
                        return;
                    }

                    var params = {
                        TableName: 'Tudi_Six_Characters',
                        Item: {
                            'char_id': {'S': author+'000'+guild},
                            'player_id': {'S': author},
                            'guild_id': {'S': guild},
                            'xp': {'N': '0'}
                        }
                    };

                    if('name' in args){
                        params.Item['name'] = {'S': args['name']};
                    }

                    if('stats' in args){
                        params.Item['stats'] = {'M': JSON.parse(args['name'])};
                    }

                    if('health' in args){
                        params.Item['max_health'] = params.Item['curr_health'] = {'N': args['health']};
                    }

                    if('playbook' in args){
                        params.Item['playbook'] = {'S': args['playbook']};
                    }

                    AWSResources.dynamodb.putItem(params, function(err, data) {
                        if (err) {
                            console.log("Error: ", err);
                            message.channel.send("Error saving character: ", err.name)
                        }
                        else {
                            console.log("Character saved: ", params.Item.name);
                        }
                    });
                }).catch(err => {
                    message.channel.send("```Error: ", err.toString(), "```");
                });
            }
        },
        {
            name: 'setstat',
            description: 'Sets a stat for a character already created',
            execute(message, args) {
                var author = message.author.id;
                var guild = message.guild.id;
                SearchForCharacter(author, guild).then(result => {
                    if (result === {} || result == null) {
                        message.channel.send("```Error: You need a character before you can edit stats```");
                        return;
                    }

                    var objectified_item = AWSResources.ddb_converter.unmarshall(result);
                    if (!'stats' in objectified_item){
                        objectified_item['stats'] = {};
                    }
                    for(const arg of Object.keys(args)) {
                        try {
                            parseInt(args[arg]);
                            objectified_item['stats'][arg] = args[arg];
                        }
                        catch(err){
                            message.channel.send("Error: The value of all stats must be numeric. " + args[arg] + " is not a number");
                            return;
                        }
                    }

                    var params = {
                        TableName: 'Tudi_Six_Characters',
                        Item: AWSResources.ddb_converter.marshall(objectified_item)
                    }

                    AWSResources.dynamodb.putItem(params, function(err, data) {
                        if (err) {
                            console.log(err);
                            message.channel.send("Error: Changing your stats failed due to the following error: " + err.toString());
                        }
                        else {
                            message.channel.send("```Stats updated```")
                        }
                    });
                });
            }
        },
        {
            name: 'deletechar',
            description: 'Deletes your character',
            execute(message, args) {
                var author = message.author.id;
                var guild = message.guild.id;
                SearchForCharacter(author, guild).then(result => {
                    console.log(result);
                    if (result === {} || result == null) {
                        message.channel.send("```Error: You don't have a character, so it cannot be deleted.```");
                        return;
                    }

                    var params = {
                        TableName: 'Tudi_Six_Characters',
                        Key: {
                            'char_id': {'S': author+'000'+guild}
                        }
                    }

                    AWSResources.dynamodb.deleteItem(params, function(err, data) {
                        if (err) {
                            console.log(err);
                            message.channel.send("Error: Deleting failed due to the following error: " + err.toString());
                        }
                        else {
                            message.channel.send("```Character deleted```");
                        }
                    });
                });
            }
        }
    ]
}