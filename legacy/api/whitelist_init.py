import os, sys


#proj_path = "/var/www/tuyo_tools/api"
proj_path = "/var/www/tuyo_tools/api"
# This is so Django knows where to find stuff.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TuyoTools.settings_base")
sys.path.append(proj_path)
 
# This is so my local_settings.py gets loaded.

os.chdir(proj_path)
 
# This is so models get loaded.
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()


from TuyoTools_accounts.models import *
import time
import json
import urllib
import urllib2
import re
import ast
from requests import request
from datetime import datetime, timedelta
from django.utils import timezone
import requests

usuarios = json.loads(os.environ.get('FB_SCRAPER_ACCOUNTS', '[]'))

facebook_user = 0
token = os.environ.get('FACEBOOK_ACCESS_TOKEN', '')

token = str(input("Token: "))
url = 'https://graph.facebook.com/v2.10/492752487593759/members?access_token=' + str(token) + '&pretty=0&limit=1000'
while url <> '':
    response = requests.get(url)
    
    jData = json.loads(response.content)
    
    if response.ok:
        import mechanize
        import time
        start_time = time.time()
        browser = mechanize.Browser()
        browser.set_handle_robots(False)
        cookies = mechanize.CookieJar()
        browser.set_cookiejar(cookies)
        browser.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.41 Safari/534.7')]
        browser.set_handle_refresh(False)
        
        url = 'https://www.facebook.com/login.php'
        browser.open(url)
        browser.select_form(nr=0)      #This is login-password form -> nr = number = 0)

        
        total_users_on_whitelist = WhiteList.objects.all().count()
        print "Using User " + usuarios[facebook_user][0]
        browser.form['email'] = usuarios[facebook_user][1]
        browser.form['pass'] = usuarios[facebook_user][2]
       
        browser.submit()
        
        
        for key in jData: 
            consum_count = 0
            
            if key == 'data': 
                for key2 in jData[key]: 
                    print '-------------------------------------------------------------------------------------------------------------'
                    print "Total Users in WL: " + str(total_users_on_whitelist) + ' Time Elapsed (in seconds): ' + str((time.time() - start_time))
                    nombre = key2['name']
                    id = key2['id']
                    
                    '''
                    Cuando se pasa de 106 consultas seguidas se "bloquea" al usuario y la url retornada es igual a www.facebook.com/UID. 
                    Esto no nos sirve.
                    Para eso
                    1) cada usuario ejecuta 50 consultas seguidas. Luego cambia en base al usuairo actual (German Alekandro).
                    2) si el consum_count == 50, el usuario se des-logea, se abre otro browser y se loguea a otro usuario.
                    3) antes de cada url consumida se duerme 3 segundos para no parecer scrappers.
                    4) si algun usuario se guardo con el uid como url, se vuelve a intentar hasta 3 veces.
                    '''
                    if consum_count == 50:
                        facebook_user +=1
                        if facebook_user>len(usuarios)-1:
                            facebook_user=0
                
                        print '------------------------------------------------------------------------------------------------------------------'
                        print '------------------------------------------------50 Users Imported - Creating new Browser---------------------------'
                        print '------------------------------------------------------------------------------------------------------------------'
                        
                        browser = mechanize.Browser()
                        browser.set_handle_robots(False)
                        cookies = mechanize.CookieJar()
                        browser.set_cookiejar(cookies)
                        browser.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.41 Safari/534.7')]
                        browser.set_handle_refresh(False)
                        
                        url = 'https://www.facebook.com/login.php'
                        browser.open(url)
                        browser.select_form(nr=0)      #This is login-password form -> nr = number = 0)
                        print "Using User " + usuarios[facebook_user][0]
                    
                        browser.form['email'] = usuarios[facebook_user][1]
                        browser.form['pass'] = usuarios[facebook_user][2]
                        print 'Login OK'
                    
                        browser.submit()
                        

                        print '------------------------------------------------------------------------------------------------------------------'
                        print '------------------------------------------------------------------------------------------------------------------'
                        consum_count = 0
                        
                    if WhiteList.objects.filter(uid=id).count()==0:
                        time.sleep(3)
                        user_site_response = browser.open('https://www.facebook.com/'+str(id))
                        if user_site_response.geturl() == 'https://www.facebook.com/'+str(id):
                            print "User blocked: " + str(facebook_user)
                        WhiteList.objects.create(uid=id, name= nombre, user_url = user_site_response.geturl())
                        print "user added: " + str(user_site_response.geturl())
                        consum_count +=1
                        total_users_on_whitelist += 1
                    else:
                        user_in_wl = WhiteList.objects.get(uid=id)
                        if user_in_wl.user_url == 'https://www.facebook.com/'+str(id) and user_in_wl.tries < 3:
                            user_in_wl.tries += 1
                            time.sleep(3)
                            user_site_response = browser.open('https://www.facebook.com/'+str(id))
                            user_in_wl.user_url = user_site_response.geturl()
                            user_in_wl.save()
                            print "user added after retry: " + str(user_site_response.geturl())
                            consum_count +=1
                            
                    
            else:
                for key2 in jData[key]: 
                    if key2 <> 'cursors': 
                        if 'next' in  jData[key]:
                            url = jData[key]['next']
                        else:
                            url = ""   
    