module.exports = function parse_args(arg_list) {
    var arg_dict = {};
    for(const arg of arg_list) {
        if(arg.startsWith('--')) {
            var parsed_arg = arg.substring(2).split('=');
            arg_dict[parsed_arg[0]] = parsed_arg.length > 1 ? parsed_arg[1] : true;
        }
    }
    return arg_dict
}