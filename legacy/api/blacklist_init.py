import os, sys


proj_path = "/var/www/tuyo_tools/api"
#proj_path = "/var/www/tuyo_tools/api"
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

        blacklisted = BlackList.objects.filter(Q(uid<>name))
        
        print "Using User " + usuarios[facebook_user][0]
        browser.form['email'] = usuarios[facebook_user][1]
        browser.form['pass'] = usuarios[facebook_user][2]
       
        browser.submit()
        block_flag = False
        
        for key in blacklisted: 
            consum_count = 0
            if consum_count == 20 or block_flag:
                facebook_user +=1
                if facebook_user>len(usuarios)-1:
                    facebook_user=0
        
                print '------------------------------------------------------------------------------------------------------------------'
                print '------------------------------------------------20 Users Sync - Creating new Browser---------------------------'
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
                block_flag = False
                
            
            time.sleep(5)
            user_site_response = browser.open('https://www.facebook.com/'+str(key.uid))
            if user_site_response.geturl() == 'https://www.facebook.com/'+str(id):
                print "User blocked: " + str(facebook_user)
                block_flag = True
            WhiteList.objects.create(uid=id, name= nombre, user_url = user_site_response.geturl())
            print "user added: " + str(user_site_response.geturl())
            consum_count +=1