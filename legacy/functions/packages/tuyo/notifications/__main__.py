import json
import os
import types
import re
import ast

import mysql.connector
#from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta

#load_dotenv()

#Environment variables needed
usr = os.getenv('dbuser')
hst = os.getenv('dbhost')
pwd = os.getenv('dbpassword')
dbtuyo = os.getenv('dbtuyo')
dbnotif = os.getenv('dbnotif')
dbmail = os.getenv('dbmail')
FACEBOOK_NOTIF_ACCESS_TOKEN = 123456

#Flags
notification_flag = False

def get_notifmanager_connection():
      cnx = mysql.connector.connect(user=usr, password=pwd,
                                    host=hst,
                                    port=25060,
                                    database=dbnotif)

      return cnx


def get_tuyotools_connection():
      cnx = mysql.connector.connect(user=usr, password=pwd,
                                    host=hst,
                                    port=25060,
                                    database=dbtuyo)

      return cnx

def get_mailsender_connection():
      cnx = mysql.connector.connect(user=usr, password=pwd,
                                    host=hst,
                                    port=25060,
                                    database=dbmail)

      return cnx

def clean_run_instance():
      print("Instance cleanup started.")

      # Get Notification Manager DB connection and cursor
      notif_cnn = get_notifmanager_connection()
      notif_cnn.autocommit = True
      notif_cur = notif_cnn.cursor()

      notif_cur.execute("SELECT id, is_running, date_start FROM notification_manager_service_runinstance WHERE is_running = 1")
      running_instances = notif_cur.fetchall()

      instance_cleanup_count = 0

      if(len(running_instances) > 0):
            for instance_row in running_instances:

                  instance = types.SimpleNamespace()
                  setattr(instance, "id", instance_row[0])
                  setattr(instance, "is_running", instance_row[1])
                  setattr(instance, "date_start", instance_row[2])

                  now = datetime.strptime((datetime.utcnow()).strftime('%Y-%m-%d %I:%M:%S'), '%Y-%m-%d %I:%M:%S')
                  instance_date = datetime.strptime((instance.date_start).strftime('%Y-%m-%d %I:%M:%S'), '%Y-%m-%d %I:%M:%S')

                  if (now - instance_date).total_seconds() > 120:
                        notif_cur.execute("UPDATE notification_manager_service_runinstance "
                                          "SET is_running = %s, date_end = %s, end_with_error = %s, end_with_error_description = %s "
                                          "WHERE id = %s",
                                          (0, datetime.utcnow(), 1, "Idle process", instance.id))

                        instance_cleanup_count += 1

      print("Instance cleanup count: " + str(instance_cleanup_count))
      print("Instance cleanup ended.")
      notif_cur.close()
      notif_cnn.close()


def run_single_action():
      print("Started run_single_action method.")
      # Get Notification Manager DB connection and cursor
      notif_cnn = get_notifmanager_connection()
      notif_cnn.autocommit = True
      notif_cur = notif_cnn.cursor()

      # Get TuyoTools DB connection and cursor
      tuyo_cnn = get_tuyotools_connection()
      tuyo_cnn.autocommit = True
      tuyo_cur = tuyo_cnn.cursor()

      # Get Mail Sender DB connection and cursor
      mail_cnn = get_mailsender_connection()
      mail_cnn.autocommit = True
      mail_cur = mail_cnn.cursor()

      current_run_instance_id = None

      try:
            #Fetch runinstance records
            notif_runinstance_query = ("SELECT id, is_running FROM notification_manager_service_runinstance WHERE is_running = 1")
            notif_cur.execute(notif_runinstance_query)
            runinstance_rows = notif_cur.fetchall()
            result_list = [list(row) for row in runinstance_rows]

            clientId = '1'  # TuyoTools
            notif_cur.execute("SELECT id, sender, mail_service_url FROM notification_manager_service_client WHERE id = 1")
            sender_row = notif_cur.fetchone()
            sender = types.SimpleNamespace()
            setattr(sender, 'id', sender_row[0])
            setattr(sender, 'sender', sender_row[1])
            setattr(sender, 'mail_service_url', sender_row[2])

            # Corroboro que no haya nada corriendo.
            #running_instance = RunInstance.objects.filter(is_running=True)
            running_instance = result_list
            print("Start: " + str(datetime.now()))
            if len(running_instance) == 0:
                  # Creo nueva instancia de run
                  #new_run_instance = RunInstance()
                  #new_run_instance.is_running = True
                  #new_run_instance.save()
                  notif_cur.execute("INSERT INTO notification_manager_service_runinstance "
                                    "(date_start, date_end, end_with_error, end_with_error_description, is_running) "
                                    "VALUES (%s, null, %s, null, %s)",
                                    (datetime.utcnow(), 0, 1))
                  current_run_instance_id = notif_cur.lastrowid

                  print("New Run Instance created")

                  print("Checking for new notifications")
                  tuyo_cur.execute("SELECT id, text, created FROM Notification WHERE new = %s", (1,))
                  new_notifications = [list(row) for row in tuyo_cur.fetchall()]

                  notification_processed_count = 0
                  rel_notif_missing_count = 0
                  mail_sent_count = 0
                  popup_shown_count = 0
                  facebook_sent_count = 0

                  for new_notification in new_notifications:
                        # print "Sync Notifications"
                        notif_cur.execute("SELECT id, notification_id FROM notification_manager_service_notificationalerts "
                                          "WHERE notification_id = %s", (new_notification[0],))

                        notification_alerts = [list(row) for row in notif_cur.fetchall()]

                        if len(notification_alerts) == 0:
                              #new_local_notification = NotificationAlerts(notification_id=new_notification.id,
                              #                                            mail_sent=False, popup_shown=False,
                              #                                            lifecycle_done=False)
                              #new_local_notification.save(using='default')
                              notif_cur.execute("INSERT INTO notification_manager_service_notificationalerts"
                                                "(notification_id, mail_sent, popup_shown, lifecycle_done, created, tries, facebook_sent, last_facebook)"
                                                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (new_notification[0], 0, 0, 0, datetime.utcnow(), 0, 0, None))

                              #new_notification.new = False
                              #new_notification.save()
                              tuyo_cur.execute("UPDATE Notification SET new = %s WHERE id = %s", (0, new_notification[0]))

                  # get all notifications that are still alive
                  #pending_state = NotificationAlerts.objects.using('default').filter(lifecycle_done=False).exclude(
                  #      tries__gte=3)
                  notif_cur.execute("SELECT NA.id, NA.mail_sent, NA.popup_shown, NA.last_mail, "
                                    "NA.last_popup, NA.facebook_sent, NA.last_facebook, NA.lifecycle_done, NA.tries, NA.notification_id, NA.created "
                                    "FROM notification_manager_service_notificationalerts as NA "
                                    "WHERE NA.lifecycle_done = %s AND NA.tries < %s;", (0, 3))
                  pending_state_alerts = [list(row) for row in notif_cur.fetchall()]
                  print("Pending state alerts: " + str(len(pending_state_alerts)))
                  # We need entities from the TUYO database that are related to the alerts
                  notif_ids = [str(row[9]) for row in pending_state_alerts]
                  notif_ids_string = ', '.join(notif_ids)
                  tuyo_cur.execute("SELECT DISTINCT N.id, N.due_date, N.data, N.text, N.read, N.processed, N.url, "
                                   "NS.mail_alert, NS.popup_alert, NS.facebook_alert, "
                                   "NT.id, NT.frequency_daily, NT.frequency_hourly, NT.popup_template, "
                                   "NT.mail_template, NT.facebook_template, NT.mail_subject_template, "
                                   "U.id, U.email, U.email_confirmed, N.facebook_uid "
                                   "FROM Notification as N "
                                   "INNER JOIN NotificationType as NT ON N.type_id = NT.id "
                                   "INNER JOIN NotificationSettings as NS ON NT.id = NS.notification_type_id "
                                   "INNER JOIN SystemUser as U ON N.user_id = U.id "
                                   "WHERE N.id IN (%s) ORDER BY N.id DESC", (notif_ids_string,))

                  related_notifications = [list(row) for row in tuyo_cur.fetchall()]

                  if len(pending_state_alerts) > 0:
                        print("We have notifications! processing...")
                        for local_notif in pending_state_alerts:
                              notification_flag = True

                              # Fill up local notification data
                              local_notification = types.SimpleNamespace()
                              setattr(local_notification, 'id', local_notif[0])
                              setattr(local_notification, 'mail_sent', local_notif[1])
                              setattr(local_notification, 'popup_shown', local_notif[2])
                              setattr(local_notification, 'last_mail', local_notif[3])
                              setattr(local_notification, 'last_popup', local_notif[4])
                              setattr(local_notification, 'facebook_sent', local_notif[5])
                              setattr(local_notification, 'last_facebook', local_notif[6])
                              setattr(local_notification, 'lifecycle_done', local_notif[7])
                              setattr(local_notification, 'tries', local_notif[8])
                              setattr(local_notification, 'notification_id', local_notif[9])
                              setattr(local_notification, 'created', local_notif[10])

                              #Find related notification from the TuyoTools DB
                              rel_notif = next((rel_notif for rel_notif in related_notifications if rel_notif[0] == local_notification.notification_id), None)

                              if rel_notif is None:
                                    rel_notif_missing_count += 1
                                    continue

                              # Fill up Notification data
                              notification = types.SimpleNamespace()
                              setattr(notification, 'id', rel_notif[0])
                              setattr(notification, 'due_date', rel_notif[1])
                              setattr(notification, 'data', rel_notif[2])
                              setattr(notification, 'text', rel_notif[3])
                              setattr(notification, 'read', rel_notif[4])
                              setattr(notification, 'processed', rel_notif[5])
                              setattr(notification, 'url', rel_notif[6])

                              # Add some more data to the local_notification object (NotificationSettings)
                              setattr(local_notification, 'should_send_mail', rel_notif[7])
                              setattr(local_notification, 'should_show_popup', rel_notif[8])
                              setattr(local_notification, 'should_send_facebook', rel_notif[9])
                              setattr(local_notification, 'days_before_due', -1)

                              # Continue with the other entities
                              notification_type = types.SimpleNamespace()
                              setattr(notification_type, 'id', rel_notif[10])
                              setattr(notification_type, 'frequency_daily', rel_notif[11])
                              setattr(notification_type, 'frequency_hourly', rel_notif[12])
                              setattr(notification_type, 'popup_template', rel_notif[13])
                              setattr(notification_type, 'mail_template', rel_notif[14])
                              setattr(notification_type, 'facebook_template', rel_notif[15])
                              setattr(notification_type, 'mail_subject_template', rel_notif[16])

                              notification_user = types.SimpleNamespace()
                              setattr(notification_user, 'id', rel_notif[17])
                              setattr(notification_user, 'email', rel_notif[18])
                              setattr(notification_user, 'email_confirmed', rel_notif[19])

                              setattr(notification, 'facebook_uid', rel_notif[20])
                              setattr(notification, 'user', notification_user)
                              setattr(notification, 'type', notification_type)

                              # we use the "mail_sent" and "popup_shown" for the first notification after creation
                              first_mail = not local_notification.mail_sent and local_notification.should_send_mail
                              first_popup = not local_notification.popup_shown and local_notification.should_show_popup
                              #notification = local_notification.get_related_notification()
                              # we have to check if it's time to send a new email or popup
                              current_time = datetime.utcnow() # timezone.now()  # timezone.make_aware(datetime.now(), timezone.utc)
                              if local_notification.last_mail is not None and local_notification.should_send_mail:
                                    time_since_last_sent = (current_time - local_notification.last_mail).total_seconds()
                              elif local_notification.last_popup is not None and local_notification.should_show_popup:
                                    time_since_last_sent = (
                                                  current_time - local_notification.last_popup).total_seconds()
                              else:
                                    time_since_last_sent = (current_time - local_notification.created).total_seconds()
                              daily = notification.type.frequency_daily
                              daily_in_seconds = 24 * 3600
                              hourly = notification.type.frequency_hourly
                              hourly_in_seconds = hourly * 3600
                              # for checking if it's due, we have to see if the notification has a refined setting attached
                              days_before_notify = local_notification.days_before_due
                              if days_before_notify > 0:
                                    notify_before_due = (current_time - (notification.due_date - timedelta(
                                          days=days_before_notify))).total_seconds() > 0
                              is_due = (current_time - notification.due_date).total_seconds() > 0
                              if (days_before_notify <= 0 or notify_before_due) and (
                                      (hourly > 0 and time_since_last_sent >= hourly_in_seconds) or (
                                      daily and time_since_last_sent >= daily_in_seconds)) or first_mail or first_popup or is_due:
                                    #print("before email if")
                                    if local_notification.should_send_mail and not local_notification.mail_sent and notification.user.email_confirmed:
                                          #print("After email if")
                                          # pass
                                          sending_mail = True
                                          #sender = Client.objects.using('default').get(id=clientId)
                                          correctly_send_email = create_email(mail_cur, notification, sender.sender,
                                                                            notification.user.email,
                                                                            sender.mail_service_url)
                                          if correctly_send_email:
                                                local_notification.last_mail = current_time
                                                if not local_notification.mail_sent:
                                                      local_notification.mail_sent = True
                                                      notif_cur.execute(
                                                            "UPDATE notification_manager_service_notificationalerts "
                                                            "SET mail_sent = %s "
                                                            "WHERE id = %s",
                                                            (1, local_notification.id))
                                                      mail_sent_count += 1

                                                #local_notification.save(using='default')
                                          sending_mail = False
                                    if local_notification.should_show_popup and not local_notification.popup_shown:
                                          sending_popup = True
                                          template = notification.type.popup_template
                                          rep = ast.literal_eval(notification.data)
                                          if '%%days_left%%' in rep:
                                                today = datetime.utcnow() # timezone.now()
                                                rep['%%due_date%%'] = notification.due_date.strftime('%d/%m/%Y')
                                                rep['%%current_date%%'] = today.strftime('%d/%m/%Y')
                                                rep['%%days_left%%'] = str((notification.due_date - today).days)
                                          pattern = re.compile("|".join(rep.keys()))
                                          notification.text = pattern.sub(lambda x: rep[x.group()], template)
                                          notification.read = False
                                          local_notification.last_popup = current_time
                                          if not local_notification.popup_shown:
                                                local_notification.popup_shown = True
                                                notif_cur.execute(
                                                      "UPDATE notification_manager_service_notificationalerts "
                                                      "SET popup_shown = %s "
                                                      "WHERE id = %s",
                                                      (1, local_notification.id))
                                                popup_shown_count += 1

                                          #local_notification.save(using='default')

                                          notification.processed = True

                                          #escaped = sqlescape(notification.text)
                                          #replaced = notification.text.replace('\n', '')
                                          #notification.save()
                                          tuyo_cur.execute(
                                                "UPDATE Notification SET text = %s, Notification.read = %s, processed = %s WHERE id = %s",
                                                (notification.text, 0, 1, local_notification.notification_id))

                                          sending_popup = False
                                    '''if local_notification.should_send_facebook and not local_notification.facebook_sent:
                                          sending_facebook = True
                                          #sender = Client.objects.using('default').get(id=clientId)
                                          correctly_send_facebook = send_facebook(notification,
                                                                                  notification.facebook_uid)
                                          if correctly_send_facebook:
                                                local_notification.last_facebook = current_time
                                                if not local_notification.facebook_sent:
                                                      local_notification.facebook_sent = True
                                                      notif_cur.execute(
                                                            "UPDATE notification_manager_service_notificationalerts "
                                                            "SET facebook_sent = %s "
                                                            "WHERE id = %s",
                                                            (1, local_notification.id))
                                                      facebook_sent_count += 1

                                                #local_notification.save(using='default')


                                          sending_facebook = False'''

                                    if is_due or (local_notification.mail_sent and local_notification.popup_shown):
                                          local_notification.lifecycle_done = True
                                          #local_notification.save(using='default')
                                          notif_cur.execute("UPDATE notification_manager_service_notificationalerts "
                                                            "SET lifecycle_done = %s "
                                                            "WHERE id = %s",
                                                            (1, local_notification.id))

                              notification_processed_count += 1

                  #new_run_instance.is_running = False
                  #new_run_instance.date_end = datetime.now()
                  #new_run_instance.save()

                  notif_cur.execute("UPDATE notification_manager_service_runinstance "
                                    "SET is_running = %s, "
                                    "date_end = %s "
                                    "WHERE id = %s",
                                    (0, datetime.utcnow(), current_run_instance_id))

                  print("Successfully processed: " + str(notification_processed_count) + " notifications.")
                  print("Missing related data: " + str(rel_notif_missing_count) + " notifications.")
                  print("Total processed: " + str(rel_notif_missing_count + notification_processed_count) + " notifications.")
                  print("Mail sent count: " + str(mail_sent_count))
                  print("Popup shown count: " + str(popup_shown_count))
                  print("Facebook sent count: " + str(facebook_sent_count))
            else:
                  current_run_instance_id = running_instance[0][0]
                  print("Instancia Corriendo - " + str(current_run_instance_id))
                  # for instance in running_instance:
                  #    if (timezone.now()- instance.date_start()).total_seconds() > 600:
                  #        instance.is_running = False
                  #        instance.date_end = datetime.now()
                  #        instance.end_with_error = 1
                  #        instance.end_with_error_description = "Idle process"
                  #        instance.save()
                  print("Idle process end")

            print("End: " + str(datetime.now()))
      except Exception as e:
            print('Error: ' + str(e))
            notif_cur.execute("UPDATE notification_manager_service_runinstance "
                              "SET is_running = %s, "
                              "end_with_error = %s, "
                              "date_end = %s, "
                              "end_with_error_description = %s "
                              "WHERE id = %s",
                              (0, 1, datetime.now(), str(e), current_run_instance_id))

            #Originally saved the error to a log file
            #print('Error: ' + str(e), 'Error generico')

            if 'local_notification' in locals():
                  local_notification.tries += 1
                  # local_notification.save(using='default')
                  notif_cur.execute("UPDATE notification_manager_service_notificationalerts "
                                    "SET tries = %s "
                                    "WHERE id = %s",
                                    (1, local_notification.tries))

                  notif_cur.execute("UPDATE notification_manager_service_runinstance "
                                    "SET end_with_error_description = %s "
                                    "WHERE id = %s",
                                    (str(e) + 'LOCAL NOTIFICATION' + str(local_notification.id), current_run_instance_id))

            print("End: " + str(datetime.now()))

            run_single_action()

      tuyo_cur.close()
      tuyo_cnn.close()
      notif_cur.close()
      notif_cnn.close()
      mail_cur.close()
      mail_cnn.close()


def create_email(mail_cur, notification, mail_sender, mail_receiver, mail_server):
      try:
            sender = mail_sender
            receiver = mail_receiver
            template = notification.type.mail_template
            subject_template = notification.type.mail_subject_template
            rep = ast.literal_eval(notification.data)
            if '%%days_left%%' in rep:
                  today = datetime.utcnow() # timezone.now()
                  rep['%%due_date%%'] = notification.due_date.strftime('%d/%m/%Y')
                  rep['%%current_date%%'] = today.strftime('%d/%m/%Y')
                  rep['%%days_left%%'] = str((notification.due_date - today).days)
            # rep = dict((re.escape(k), v) for k, v in rep.iteritems())
            # pattern = re.compile(r'\b(' + '|'.join(rep.keys()) + r')\b')
            # print notification.data
            # print template
            pattern = re.compile("|".join(rep.keys()))
            message = (pattern.sub(lambda x: (
                  str(rep[x.group()]) if isinstance(rep[x.group()], str) else rep[x.group()]),
                                   template)).encode("utf-8")
            subject = (pattern.sub(lambda x: (
                  str(rep[x.group()]) if isinstance(rep[x.group()], str) else rep[x.group()]),
                                   subject_template)).encode("utf-8")
            # subject = notification.text
            # SHA TODO SHA_TODO Cambiar esto que es espantoso
            url = u''.join(str(notification.url)).encode('UTF-8').strip()
            header = '''<!DOCTYPE html>
                        <html>
                            <head>
                                <meta charset="utf-8">
                                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                                <title>Si lo venís a buscar es Tuyo</title>
                                <link href="https://fonts.googleapis.com/css?family=Montserrat:400,600" rel="stylesheet">
                            </head>
                            <body style="font-family: 'Montserrat', sans-serif;">
                                <!-- si lo venis a buscar es tuyo -->
                                <table cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto;">

                                    <tbody>
                                        <tr>
                                            <td>
                                                <div role="banner" style="text-align:center; padding-bottom: 5px;">
                                                    <a target="_blank" href="https://tuyo.uy"><img src="https://tuyo.uy/assets/images/mail/header.png"/></a>
                '''
            footer = '''
                                                    <p><strong style="font-weight: 800;">Por favor, NO RESPONDER este correo.</strong></p>
                                                        </div>
                                                    </tr>

                                            </tbody>
                                        </table>
                                    </body>
                                </html>
        '''

            message = header + message.decode() + footer
            subject = subject.decode()
            post_data = {'sender': sender, 'receiver': receiver, 'subject': subject, 'message': message}
            to_send = json.dumps(post_data)
            try:
                  # Create email record on mailsender DB
                  #r = requests.post(mail_server + "/mail_manager/", data=to_send, timeout=3)
                  mail_cur.execute("SELECT id FROM mail_sender_service_emailaccount WHERE login_user = %s", (sender,))
                  sender_id = mail_cur.fetchone()[0]
                  mail_cur.execute("INSERT INTO mail_sender_service_email "
                                   "(subject, message, receiverEmailAddress, dateTimeInsert, tries, _State_id, senderEmailAddress_id, error_desc) "
                                   "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (subject, message, receiver, datetime.utcnow(), 0, 1, sender_id, ""))
                  return True
            except Exception as e:
                  #raise e
                  if notification_flag:
                        print("got error when trying to send mail - " + str(e))
                  return False
      except Exception as e:
            print
            "got error when creation email - " + str(e)
            return False


'''def send_facebook(notification, user_uid):
      try:
            access_token = FACEBOOK_NOTIF_ACCESS_TOKEN
            r = requests.post(
                  "https://graph.facebook.com/%s/notifications?access_token=%s&template=Tienes notificaciones importantes en tuyo.uy!" % (
                  user_uid, access_token))
            if r.status_code == 200:
                  return True
            else:
                  return False
      except Exception as e:
            if notification_flag:
                  print("got error when sending facebook notification - " + str(e))
            return False'''

clean_run_instance()
run_single_action()
