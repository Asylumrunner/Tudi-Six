const AWS = require('aws-sdk');
const aws_credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

const dynamodb = new AWS.DynamoDB({
	region: 'us-east-1',
	credentials: aws_credentials
});

const ddbconverter = AWS.DynamoDB.Converter;

module.exports = {
	'dynamodb': dynamodb,
	'ddb_converter': ddbconverter
};