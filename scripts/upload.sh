#!/usr/bin/env bash

# Upload /page to site's s3 bucket

PAGE_DIRECTORY="./page"
S3_BUCKET=$S3_BUCKET_NAME

BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT_SHA=$(git rev-parse --short HEAD)

pwd
ls -la

echo "Uploading: <${PAGE_DIRECTORY}> (from <${BRANCH}> @ <${COMMIT_SHA}>) to <${S3_BUCKET}>"

for entry in "${PAGE_DIRECTORY}"/*; do
    item=$(echo "${entry}" | sed 's/.*\///')  # getting the name of the file or directory
    if [[ -d  ${entry} ]]; then  # if it is a directory
        aws s3 cp "${PAGE_DIRECTORY}/${item}" "s3://${S3_BUCKET}/${item}/" --recursive --region eu-west-1
    else  # if it is a file
        aws s3 cp "${PAGE_DIRECTORY}/${item}" "s3://${S3_BUCKET}/" --region eu-west-1
    fi
done
