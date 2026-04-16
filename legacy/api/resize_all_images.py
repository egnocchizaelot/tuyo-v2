# -*- encoding: utf-8 -*-
import os, sys, time
from TuyoTools.settings_base import MEDIA_ROOT, MAX_WIDTH_IMAGE, MIN_WIDTH_IMAGE

from PIL import Image

#Variable global para que sea el unico punto de cambio al cambiar el environment de desarrollo a test/produccion
ENVIRONMENT = sys.argv[1]
 
proj_path =''
# Open database connection
if ENVIRONMENT == 'dev':
    proj_path = "/var/www/tuyo_tools/api"
elif ENVIRONMENT == 'test':
    proj_path = "/var/www/tuyo_tools/api"
elif ENVIRONMENT == 'prod':
    proj_path = '/var/www/tuyo_tools/api'

 
media_path = proj_path + '/media/files'
# donations_files = media_path + '/donations/'

from os import listdir
from os.path import isfile, join

for subdir, dirs, files in os.walk(media_path):
#     dirs.sort(key=int)
    valid_extensions = ['.jpg', '.jpeg', '.png']
    for file in files:
        file_path =  os.path.join(subdir, file)
        print file_path
        ext = os.path.splitext(file)[1]  # [0] returns path+filename
        if not 'thumbnail' in file_path and ext.lower() in valid_extensions:
            img = Image.open(file_path)
            
            if img.size[0] > MAX_WIDTH_IMAGE:
                wpercent = (MAX_WIDTH_IMAGE/float(img.size[0]))
                hsize = int((float(img.size[1])*float(wpercent)))
                img = img.resize((MAX_WIDTH_IMAGE,hsize), Image.ANTIALIAS)
                img.save(file_path)