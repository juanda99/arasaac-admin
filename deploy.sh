#!/bin/bash

# Get the version from the parameter
VERSION=$1

# If version is empty, exit with warning
if [ -z "$VERSION" ]
then
  echo "No version specified. Usage: ./deploy.sh <version>"
  exit 1
fi

# Build the project
npm run build

# Build the Docker image
docker build -t cateduac/arasaac-admin:$VERSION .

# Push the Docker image to Docker Hub
docker push cateduac/arasaac-admin:$VERSION

# Tag and push the Docker image as "latest"
docker tag cateduac/arasaac-admin:$VERSION cateduac/arasaac-admin:latest
docker push cateduac/arasaac-admin:latest

# Tag and push the Docker image with the major version (e.g. 1)
MAJOR_VERSION=$(echo $VERSION | cut -d. -f1)
docker tag cateduac/arasaac-admin:$VERSION cateduac/arasaac-admin:$MAJOR_VERSION
docker push cateduac/arasaac-admin:$MAJOR_VERSION

# Tag and push the Docker image with the major-minor version (e.g. 1.0)
MAJOR_MINOR_VERSION=$(echo $VERSION | cut -d. -f1-2)
docker tag cateduac/arasaac-admin:$VERSION cateduac/arasaac-admin:$MAJOR_MINOR_VERSION
docker push cateduac/arasaac-admin:$MAJOR_MINOR_VERSION
