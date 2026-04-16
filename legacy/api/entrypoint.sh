#!/usr/bin/env bash
printenv > /etc/environment
cron
#cat /etc/environment
source /etc/environment

echo "Esperando a que MySQL esté listo..."
while ! mysqladmin ping -h"$dbhost" --silent 2>/dev/null; do
    sleep 2
done
echo "MySQL listo!"

python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000

