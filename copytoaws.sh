#!/bin/bash

# Copy the necessary files to the AWS machine.
# This script is invoked after the commit stage,
# that is after jenkins has succesfully built the program
echo Copying necessary files to AWS instance
scp -i ../admin-key-key-ireland.pem ./{docker-compose.yaml,.env} ec2-user@52.51.82.250:~/
echo Done copying to AWS instance
