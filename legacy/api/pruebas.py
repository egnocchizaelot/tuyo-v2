import mechanize
from fuzzywuzzy import process, fuzz

import StringIO

from requests import request, HTTPError
from PIL import Image
from django.core.files.base import ContentFile
from django.contrib.auth import login as auth_login, logout as auth_logout
from social_django.models import UserSocialAuth

from TuyoTools_accounts.models import SystemUser, GlobalCounters, BlackList, WhiteList, LogHistory,ForbidenNames
import itertools


from datetime import datetime 
blackListUsers = BlackList.objects.all()

names = set(blackListusr.name for blackListusr in blackListUsers)
names = blackListUsers


print "Extract One - scorer=fuzz.token_sort_ratio"

print "------------"
print 'Laura Gonzalez -:' + str( process.extractOne("Laura Gonzalez", names,scorer=fuzz.token_sort_ratio))
print 'Claudia Garcia -:' + str( process.extractOne("Claudia Garcia", names,scorer=fuzz.token_sort_ratio))
print 'Ana Gonzalez -:' + str( process.extractOne("Ana Gonzalez", names,scorer=fuzz.token_sort_ratio))