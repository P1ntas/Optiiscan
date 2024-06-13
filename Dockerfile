FROM node:21

WORKDIR /app

COPY . .

RUN apt-get update && \
    apt-get install -yq --no-install-recommends \
    curl \
    wget \
    git \
    gnupg \
    graphicsmagick \
    ghostscript

RUN curl -sSL https://sdk.cloud.google.com | bash

ENV PATH $PATH:/root/google-cloud-sdk/bin

ENV PORT=3000

RUN npm ci

RUN npm run build

# Change this for prod (https://mydomain.com)
ENV ORIGIN=http://localhost:3000

ENV BODY_SIZE_LIMIT=Infinity

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/gemini/project_config.json

EXPOSE 8080

RUN gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS

CMD ["node", "build"]