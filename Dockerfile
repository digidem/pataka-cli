FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Expose Pataka ports
# https://gitlab.com/ahau/lib/ahau-env/-/blob/master/index.js#L108-121
EXPOSE 3000
EXPOSE 8088
EXPOSE 18088

CMD [ "npm", "start" ]
