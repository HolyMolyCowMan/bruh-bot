FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# For dev
# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

## following 3 lines are for installing ffmepg
RUN apk update
RUN apk add
RUN apk add ffmpeg

# Copy over source code
COPY . .

RUN node deploy-commands.js

EXPOSE 8080
CMD [ "node", "index.js" ]
