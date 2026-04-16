FROM python:2.7.18-buster

RUN echo "deb http://archive.debian.org/debian buster main" > /etc/apt/sources.list && \
    echo "deb http://archive.debian.org/debian-security buster/updates main" >> /etc/apt/sources.list
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y gcc
RUN apt-get -y install python2.7-dev default-libmysqlclient-dev build-essential
RUN apt-get install -qy graphviz default-mysql-client libmariadbclient-dev wget host
#RUN wget https://raw.githubusercontent.com/paulfitz/mysql-connector-c/master/include/my_config.h -O /usr/include/mysql/my_config.h
RUN apt-get -y install libssl-dev
RUN apt-get -y install python-mysqldb
RUN pip install mysql-connector-python
RUN sed  '/st_mysql_options options;/a unsigned int reconnect;' /usr/include/mysql/mysql.h -i.bkp
#RUN pip install MySQL-Python

WORKDIR /tuyotoolsbe

COPY . .

RUN pip install -r requirements.txt

#RUN python manage.py migrate
#RUN python manage.py collectstatic --noinput

#Create CRON
RUN apt-get install cron -y
COPY crontab/cron-file /etc/cron.d/cron-file
RUN chmod 0644 /etc/cron.d/cron-file
RUN crontab /etc/cron.d/cron-file
RUN touch /var/log/cron.log

EXPOSE 8000

# runs the production server
RUN ["chmod", "+x", "/tuyotoolsbe/entrypoint.sh"]
ENTRYPOINT ["/tuyotoolsbe/entrypoint.sh"]

#ENTRYPOINT ["python", "manage.py"]
#CMD ["runserver", "0.0.0.0:8000"]



