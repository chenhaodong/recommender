FROM ubuntu:16.04
MAINTAINER chenhodong
USER root
RUN apt-get update && apt-get install -y nodejs r-base npm libcurl4-openssl-dev libxml2-dev
RUN Rscript -e "install.packages('tidyverse', repos='https://pbil.univ-lyon1.fr/CRAN/')"
RUN ln -s /usr/bin/nodejs /usr/bin/node
COPY recommender /root/recommender
RUN mv /root/recommender /recommender && cd /recommender && npm install && npm install formidable
COPY dumb-init /usr/bin/dumb-init
RUN chmod +x /usr/bin/dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["bash", "-c", "cd /recommender && npm start"]
