FROM google/cloud-sdk:latest

WORKDIR /app

COPY . /app

COPY ./application_default_credentials.json /root/.config/gcloud/application_default_credentials.json

#ENV GOOGLE_APPLICATION_CREDENTIALS=/Users/phranklin/.config/gcloud/application_default_credentials.json

EXPOSE 8080

CMD ["tail", "-f", "/dev/null"]