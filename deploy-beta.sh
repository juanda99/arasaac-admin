#!/bin/bash

# Get the version from the parameter
VERSION=$1

# If version is empty, exit with warning
if [ -z "$VERSION" ]
then
  echo "No version specified. Usage: ./deploy-beta.sh <version>"
  exit 1
fi

if [[ $VERSION != *"beta"* ]]; then
  echo "Version must include 'beta'."
  exit 1
fi

# Build the project
npm run build

# Build the Docker image
docker build -t cateduac/arasaac-admin:$VERSION .

# Push the Docker image to Docker Hub
docker push cateduac/arasaac-admin:$VERSION
