FROM google/cloud-sdk:latest

WORKDIR /app

COPY . .
COPY ./gemini/application_default_credentials.json /root/.config/gcloud/application_default_credentials.json

RUN apt-get update && \
    apt-get install -yq --no-install-recommends \
    curl \
    wget \
    git \
    gnupg \
    graphicsmagick \
    ghostscript

RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
    apt-get install -y nodejs \
    build-essential && \
    node --version && \
    npm --version

RUN npm ci

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/gemini/engaged-hash-420315-b905aaec82f9.json

EXPOSE 8080

RUN gcloud auth activate-service-account 322850774257-compute@developer.gserviceaccount.com --key-file=$GOOGLE_APPLICATION_CREDENTIALS

CMD ["npm", "run", "dev"]
