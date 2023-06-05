# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/foundation

# Install jq
RUN apt-get update && apt-get install -y jq

# Install pnpm at the global level
RUN npm install -g pnpm prisma

# Copy pnpm's lock file
COPY pnpm-lock.yaml ./

# Copu pnpm's workspace.yaml file
COPY pnpm-workspace.yaml ./

# Copy the main package.json and package-lock.json (if available)
COPY package*.json ./

# Copy all of your workspace folders
COPY packages/ ./packages/

# Copy all of your scripts
COPY scripts/ ./scripts/

# Install any needed dependencies
RUN pnpm install --frozen-lockfile

# This command will start your app (modify as per your start script)
CMD [ "pnpm", "run", "dev" ]

# Expose the port your app runs on
EXPOSE 3000