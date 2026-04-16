# -*- encoding: utf-8 -*-
import MySQLdb
 
ENVIRONMENT = 'LOCAL'
#ENVIRONMENT = 'TEST'
ENVIRONMENT = 'PRODUCTION'
 
proj_path =''
# Open database connection
if ENVIRONMENT == 'LOCAL':
    tt_db = MySQLdb.connect(user='', passwd='',host='127.0.0.1',db='')
    tt_db_name = 'tuyotools_test5'
    proj_path = ""
elif ENVIRONMENT == 'TEST':
    tt_db = MySQLdb.connect(user='', host='', passwd='',db='')
    tt_db_name = 'tuyotools_prod'
    proj_path = ""

elif ENVIRONMENT == 'PRODUCTION':
    tt_db = MySQLdb.connect(user='', host='', passwd='',db='')
    tt_db_name = 'tuyotools_prod'
    proj_path = ''
# prepare a cursor object using cursor() method
cursor = tt_db.cursor()
 
 
cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
#TRUNCATE DE TABLAS DE VEHICULOS DE T1
cursor.execute("TRUNCATE " + tt_db_name + ".authtoken_token;")
cursor.execute("TRUNCATE " + tt_db_name + ".django_admin_log;")
cursor.execute("TRUNCATE " + tt_db_name + ".django_session;")
cursor.execute("TRUNCATE " + tt_db_name + ".Notification;")
cursor.execute("TRUNCATE " + tt_db_name + ".NotificationSettings;")
cursor.execute("TRUNCATE " + tt_db_name + ".social_auth_usersocialauth;")
cursor.execute("TRUNCATE " + tt_db_name + ".SystemUser;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_address;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_applicant;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_appreciation;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_appreciationfile;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_appreciationheader;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_complaint;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_complaintfile;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_configavisos;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_deferrednotification;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_entitydeferrednotificationscale;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_donation;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_donationaddress;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_donationfile;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_donationhistory;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_entity;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_errorlog;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_forum;")
cursor.execute("UPDATE " + tt_db_name + ".TuyoTools_accounts_globalcounters SET count = 0 where id in (1,2,3);")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_suggestionsconfiguration;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_importantnotice;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_importantnotice_user_disabled;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_like;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_loghistory;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_message;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_messagefile;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_notice;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_privateuserdata;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_rate;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_rateheader;")
#cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_blacklist;")
#cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_accounts_whitelist;")

#cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_helpers_helparea;")
#cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_helpers_helptopic;")
#cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_helpers_helptopic_related_topics;")
cursor.execute("TRUNCATE " + tt_db_name + ".TuyoTools_helpers_helpmessage;")
cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
 
# Commit your changes in the database
tt_db.commit()
# disconnect from server
tt_db.close()
 
print ENVIRONMENT
if ENVIRONMENT == 'LOCAL':
    nm_db = MySQLdb.connect(user='', passwd='',host='',db='notification_manager')
elif ENVIRONMENT == 'TEST':
    nm_db = MySQLdb.connect(user='', host='', passwd='',db='notification_manager')
elif ENVIRONMENT == 'PRODUCTION':
    nm_db = MySQLdb.connect(user='', host='', passwd='',db='notification_manager')

# prepare a cursor object using cursor() method
cursor = nm_db.cursor()
  
cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
cursor.execute("TRUNCATE notification_manager.notification_manager_service_errorlog;")
cursor.execute("TRUNCATE notification_manager.notification_manager_service_notificationalerts;")
cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
#Commit your changes in the database
nm_db.commit()
  
# disconnect from server
nm_db.close()


###CREATION OF SUPERUSERS###
import os, sys
#proj_path = ""
#proj_path = "/var/www/t1_connections/connection_service"
# This is so Django knows where to find stuff.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TuyoTools.settings_base")
sys.path.append(proj_path)
 
# This is so my local_settings.py gets loaded.
os.chdir(proj_path)
 
# This is so models get loaded.
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
from TuyoTools_accounts.models import *


#Creacion de entidades de Usuario.
usuarios = SystemUser.objects.all()
for usr in usuarios:
    suentity = Entity.objects.filter(type_of_entity = 'S', object_id = usr.id)
    if len(suentity)==0:
        ent = Entity.objects.CreateEntity(usr.id ,'S')
        
#Fin Creacion de entidades de usuario.



admin = SystemUser.objects.create_superuser('', '', '')
admin.type_id = 1
admin.can_apply = True
admin.enabled = True
admin.save()
beadmin = SystemUser.objects.create_superuser('', '', '')
beadmin.type_id = 2
beadmin.can_apply = True
beadmin.enabled = True
print 'terminado'
beadmin.save()

print "Comienzo de eliminado de archivos en /media"
#Eliminamos los archivos del folder media
if ENVIRONMENT != 'LOCAL':
    os.system('rm -rf '+ proj_path + '/media/files/appreciations/*')
    os.system('rm -rf '+ proj_path + '/media/files/donations/*')
    os.system('rm -rf '+ proj_path + '/media/files/important_notices/*')
    os.system('rm -rf '+ proj_path + '/media/profile_picture/*')
print "Fin de eliminado de archivos en /media"
