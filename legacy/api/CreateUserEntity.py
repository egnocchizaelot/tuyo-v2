import os, sys
#proj_path = "/var/www/tuyo_tools/api"
#proj_path = "/var/www/t1_connections/connection_service"
# This is so Django knows where to find stuff.

ENVIRONMENT = 'PRODUCTION'
proj_path = ''
# Open database connection
if ENVIRONMENT == 'LOCAL':
    proj_path = "/var/www/tuyo_tools/api"
elif ENVIRONMENT == 'TEST':
    proj_path = "/var/www/tuyo_tools/api"
elif ENVIRONMENT == 'PRODUCTION':
    proj_path = '/var/www/tuyo_tools/api'
# prepare a cursor object using cursor() method

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TuyoTools.settings_base")
sys.path.append(proj_path)
 
# This is so my local_settings.py gets loaded.
os.chdir(proj_path)
 
# This is so models get loaded.
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
from TuyoTools_accounts.models import *


usuarios = SystemUser.objects.all()
for usr in usuarios:
    suentity = Entity.objects.filter(type_of_entity = 'S', object_id = usr.id)
    if len(suentity)==0:
        ent = Entity.objects.CreateEntity(usr.id ,'S')