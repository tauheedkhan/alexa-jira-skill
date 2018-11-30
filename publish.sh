#!/bin/sh
rm -rf lambda-upload.zip
zip lambda-upload.zip -r .
aws lambda update-function-code --function-name jira-skill --zip-file fileb://lambda-upload.zip
