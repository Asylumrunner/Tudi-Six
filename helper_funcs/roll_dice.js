module.exports = function rollDice(dice_expr, modifier=0) {
    var split_expr = dice_expr.split('d');
    var num_dice = split_expr[0];
    var dice_size = split_expr[1];

    var total = modifier;
    for(i = 0; i < parseInt(num_dice); i++) {
        total += Math.floor(Math.random() * parseInt(dice_size)) + 1;
    }

    return total;
}