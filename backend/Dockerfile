FROM node

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . . 

# Generate Prisma client and run migrations
RUN npx prisma generate
RUN npx prisma migrate dev --name init
RUN npx prisma migrate dev

EXPOSE 8000

CMD [ "npm", "run", "dev" ]
