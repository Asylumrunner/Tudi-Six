const DiceRoll = require('../helper_funcs/roll_dice.js')

module.exports = {
    commands: [
        {
            name: 'ping',
            description: 'Simple health ping',
            execute(message) {
                message.channel.send('Ping!');
            }
        }
    ]
}