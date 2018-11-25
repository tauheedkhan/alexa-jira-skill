#!/bin/sh
# npm prune --production
zip Artifact/lambda.zip lambda/*.js -r node_modules
# aws lambda update-function-code --function-name jira-skill --zip-file fileb://lambda-upload.zip
