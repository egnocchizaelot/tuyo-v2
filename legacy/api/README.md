TuyoTools Proyect - 

### Development ###
Build local Docker container making sure changes will take effect:
- sudo docker build . --no-cache -t tuyotoolsbe
Run local Docker container with .env file:
- sudo docker run --env-file .env tuyotoolsbe


==========================

Django Proyects for TuyoTools

TuyoTools consists of 5 important Projects:

- TuyoTools - BE(core of Applications)
    PATH UBUNTU: /var/www/tuyo_tools/api/
    This project consists of four apps:
    
    * tuyotools:
      Project settings and the like. It contains different settings for different environments.
        settings_base: contains base settings for all environments
        settings_local: settings for local(develop) environment
        settings_prod: settings for producction environment
        settings_test: settings for test environment
        pipelines: This file defines operations that are used on user social login.
    * tuyotools_accounts:
      Project that contains logic models for users accounts and all the logic related to donation.
      Contains a folder with all the Managers for all Models
    * tone_insurance_api:
      API whth logic of all project in views and utilities
      Serializers and Authentication
    * tuyotools_helpers:
      Project that contains logic models and views for help section of web application

    Also we have requirements.txt and some folders for templates (for admin) and other for the static and new files.
    
    To access django admin, credentials are:
        
        In case of loss of password, or change of password, the way to reset it is the following:
        - First we activate the environment in console:
            PROD/TEST: 'cd /var/www/tuyo_tools' -> 'source api_env/bin/activate'
        - Second, we access the api project path (command: 'cd /api') and execute the following command:
            PROD/TEST: python manage.py shell (this luch InteractiveConsole)
            We hace to import SystemUsers model from tuyotools_accounts:
                'from TuyoTools_accounts.models import SystemUser'
                'admin = SystemUser.objects.get(username='admin')'
                'admin (to check we hace the correct user)'
                'admin.set_password('new_password')'
                'admin.save()'
            
    **DEPLOYMENT PLAN**
    This project has different branches on git repository:
    For deploy in production/test we have to make all the required merges in development branch (master) 
    and then we stand on production/test branch and make a merge from master to actual branch (production/test)
    After doing this in development environment go to the environment production/test and go to apis project path ('cd /var/www/tuyo_tools/api')
    Before fit pull, check you dont have changes for commit, and double check you are in production/test branch ('git branch' - shows in green wich branch you are stand on)
    After this, you run command 'git pull'
    
    You should check pending migrations. In case of new migrations, activate environment and go to api path.
    Run command:'python manage.py migrate'
    
    Also, you should check new libraries dependencies in environment. In case of new libraries, activate environment, and install 
    the libraries (usually with command: 'pip install library_name')
    
    Check in TuyoTools/settings_base.py at the bottom of file, variable ENVIRONMENT match the actual environment (DEV/TEST/PROD) 
    
    After this, run command: 'sudo service apache2 restart'
    
- TuyoTools - FE
    PATH UBUNTU: /var/www/tuyo_tools/www/
    
    This project is build with AngularJS using grunt. It contains all Client-site information.
    
    **DEPLOYMENT PLAN**
    For deploy we are currently running the command: 'grunt build' (sometimes --force is needed) to build the project 
    and then we copy all files in DIST folder on path: '/var/www/tuyo_tools/www'
    
    Before build, check that deploy_config.js file ENVIRONMENT variable is correctly set for the environment you are gonna deploy the project.


- NotificationManager (project that process Notifications created on TuyoTools environment) 
    PATH UBUNTU: /var/www/notificationmanager
    
    **DEPLOYMENT PLAN**
    Similar as TuyoTools - BE, but it only has 1 branch

- EmailSender (project that process Emails created on TuyoTools environment and NotificationManager)
    PATH UBUNTU: /var/www/mailsender
    
    **DEPLOYMENT PLAN**
    Similar as TuyoTools - BE, but it only has 1 branch

- SocketIo
    PATH UBUNTU: /var/www/tuyo_tools/socketio
    This project enables real-time bidirectional event-based communication between Client(FE) and Server(BE), asking BE for new changes and communicating it to Client
    This project runs with FOREVER, so evry time we make a change on it we should restart forever process. To do this:
    Go to project PATH and go into Server folder. Run command: 'sudo forever start index.js'
    After this, check forever list 'sudo forever list' (IMPORTAN: sudo command is important, because forever has different procces for sudo and for normal users)
    This command lists all forever running processes. Check logFile to ensure it starts right, command: 'pico /home/<user>/.forever/XXXX.log' where XXXX is the uid of forever process listed
    
    Before forever start/restart, check that deploy_config.js file ENVIRONMENT variable is correctly set for the environment you are deploying the project.

**VERY IMPORTANT NOTES**
- After any change in server, run command: 'sudo service apache2 restart' to restart server. After this, check forever is still running. 
  NotificationManager and EmailSender starts automatically, but its advisable to check that they are running their thread. (To do this, go to project django admin, and check Client thread is running: inside Client model, check attribute Thread has something similar to '..t_sender...')

- Python package list in `requirements.txt`, use `pip install -r requirements.txt` (with environment activate)

- ****DO NOT USE SYNCDB****, FOR INITIAL MIGRATION:
    - Run python manage.py migrate tone_insurance_accounts (this will migrate all models to MySQL DB)
    - Run python manage.py migrate (this will migrate some django tables)


Create virtual link to other server (MEDIA SOLUTION)
sudo sshfs -o allow_other,uid=1000,gid=1000 <user>@<server_ip>:<remote_media_path> /var/tuyo/media