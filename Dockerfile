FROM node:20
WORKDIR /usr/src/app
COPY ./scripts .
RUN bash stean.sh
EXPOSE 8029
CMD bash run.sh
