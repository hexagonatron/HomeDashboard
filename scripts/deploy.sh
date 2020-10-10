#!/usr/bin/bash

if [[ (-z $DEPLOY_USER) || (-z $DEPLOY_IP) || (-z $DEPLOY_PATH)]]; then
    echo "The env variables DEPLOY_USER, DEPLOY_PATH AND DEPLOY_IP need to be set"
    exit 0
fi

echo "Test"