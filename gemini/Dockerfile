FROM google/cloud-sdk:latest

WORKDIR /app

COPY . /app
COPY ./application_default_credentials.json /root/.config/gcloud/application_default_credentials.json

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/engaged-hash-420315-b905aaec82f9.json

EXPOSE 8080

CMD gcloud auth activate-service-account 322850774257-compute@developer.gserviceaccount.com --key-file=$GOOGLE_APPLICATION_CREDENTIALS && python3 gemini.py && tail -f /dev/null
