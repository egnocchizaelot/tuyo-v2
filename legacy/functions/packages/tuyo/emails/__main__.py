import os
import types

import mysql.connector
#from dotenv import load_dotenv
from datetime import datetime
import time
from boto3 import client as boto3client
from botocore.exceptions import ClientError

#load_dotenv()

#Environment variables needed
usr = os.getenv('dbuser')
hst = os.getenv('dbhost')
pwd = os.getenv('dbpassword')
dbmail = os.getenv('dbmail')


def get_mailsender_connection():
      cnx = mysql.connector.connect(user=usr, password=pwd,
                                    host=hst,
                                    port=25060,
                                    database=dbmail)

      return cnx


def errorLog(description, exception, mail_cur):
      try:
            #error = ErrorLog()
            #error.description = str(description)
            #error.exception = str(exception)
            #error.save()
            mail_cur.execute("INSERT INTO mail_sender_service_errorlog (description, exception, date) "
                             "VALUES (%s, %s, %s)", (description, exception, datetime.utcnow()))
      except Exception as ex:
            # Generate txt file in case database error
            #file = open(settings.MEDIA_ROOT + "Error_Log.txt", 'a')  # Trying to create a new file or open one
            date = datetime.now()
            print("Error: \n   Descripcion: " + str(description) + "\n   Excepcion: " + str(
                  exception) + "\n   Fecha: " + str(date) + "\n")


flag_email = False


def run_single_action():

      print("Started run_single_action method.")
      # Get Mail Sender DB connection and cursor
      mail_cnn = get_mailsender_connection()
      mail_cnn.autocommit = True
      mail_cur = mail_cnn.cursor()

      current_run_instance_id = None

      try:

            clientId = '1'  # TuyoTools
            #mail_cur.execute(
            #      "SELECT id, sender, mail_service_url FROM mail_sender_service_client WHERE id = %s", (clientId,))
            #sender_row = mail_cur.fetchone()
            #sender = types.SimpleNamespace()
            #setattr(sender, 'id', sender_row[0])
            #setattr(sender, 'sender', sender_row[1])
            #setattr(sender, 'mail_service_url', sender_row[2])

            # Corroboro que no haya nada corriendo.
            mail_cur.execute("SELECT id, is_running FROM mail_sender_service_runinstance WHERE is_running = 1")
            running_instance = mail_cur.fetchall()
            print("Start: " + str(datetime.now()))
            print("Instancia Corriendo? - " + str(running_instance))

            if len(running_instance) == 0:
                  # Creo nueva instancia de run
                  #new_run_instance = RunInstance()
                  #new_run_instance.is_running = True
                  #new_run_instance.save()

                  mail_cur.execute(
                        "INSERT INTO mail_sender_service_runinstance (date_start, date_end, end_with_error, end_with_error_description, is_running) VALUES (%s, null, %s, null, %s)",
                        (datetime.utcnow(), 0, 1))
                  current_run_instance_id = mail_cur.lastrowid

                  print("New Run Instance created")

                  # Obtengo todos los mensajes pendientes
                  mail_cur.execute("SELECT id, description FROM mail_sender_service_email_state WHERE id = 1")
                  pending_state = mail_cur.fetchone()

                  mail_cur.execute("SELECT id, subject, message, receiverEmailAddress, dateTimeLastTrie, tries, senderEmailAddress_id "
                                   "FROM mail_sender_service_email WHERE _State_id = %s", (1,))
                  pending_emails = mail_cur.fetchall()

                  '''mail_cur.execute(
                        "SELECT id, subject, message, receiverEmailAddress "
                        "FROM mail_sender_service_email_group WHERE _State_id = %s", (1,))
                  pending_groupEmails = mail_cur.fetchall()'''

                  if len(pending_emails) > 0:
                        print('pending emails = ' + str(len(pending_emails)))
                        for email_row in pending_emails:

                              email = types.SimpleNamespace()
                              setattr(email, "id", email_row[0])
                              setattr(email, "subject", email_row[1])
                              setattr(email, "message", email_row[2])
                              setattr(email, "receiverEmailAddress", email_row[3])
                              setattr(email, "dateTimeLastTrie", email_row[4])
                              setattr(email, "tries", email_row[5])
                              setattr(email, "senderEmailAddress_id", email_row[6])

                              time.sleep(0.3)
                              email_flag = True
                              email.dateTimeLastTrie = datetime.utcnow() # timezone.now()  # datetime.now()

                              if email.tries <= 3:
                                    send_email(email, mail_cur)
                              else:
                                    #error_state = Email_State.objects.get(id=3)
                                    #email._State = error_state
                                    #email.save()
                                    mail_cur.execute("UPDATE mail_sender_service_email "
                                                     "SET tries = %s, _State_id = %s, dateTimeLastTrie = %s, WHERE id = %s",
                                                     (email.tries, 3, email.dateTimeLastTrie, email.id))

                                    print("email state -> Error")
                        email_flag = False

                  #new_run_instance.is_running = False
                  #new_run_instance.date_end = datetime.now()
                  #new_run_instance.save()

                  mail_cur.execute("UPDATE mail_sender_service_runinstance "
                                    "SET is_running = %s, "
                                    "date_end = %s "
                                    "WHERE id = %s",
                                    (0, datetime.utcnow(), current_run_instance_id))

            print
            "End: " + str(datetime.now())

      except Exception as e:

            #new_run_instance = RunInstance.objects.latest('id')
            #new_run_instance.is_running = False
            #new_run_instance.end_with_error = True
            #new_run_instance.date_end = datetime.now()
            #new_run_instance.end_with_error_description = str(e)
            #new_run_instance.save()

            mail_cur.execute("UPDATE mail_sender_service_runinstance "
                             "SET is_running = %s, "
                             "date_end = %s, "
                             "end_with_error = %s, "
                             "end_with_error_description = %s "
                             "WHERE id = %s",
                             (0, datetime.utcnow(), 1, str(e), current_run_instance_id))

            errorLog('Error: ' + str(e), 'Error Generico', mail_cur)

            if 'email' in locals():
                  email.tries += 1
                  #email.save()
                  mail_cur.execute("UPDATE mail_sender_service_email "
                                   "SET tries = %s WHERE id = %s", (email.tries, email.id))

            print("End: " + str(datetime.now()))

      mail_cur.close()
      mail_cnn.close()


def send_email(email, mail_cur):
      try:

            mail_cur.execute("SELECT id, login_user, amountEmailsSend "
                             "FROM mail_sender_service_emailaccount "
                             "WHERE id = %s",
                             (email.senderEmailAddress_id, ))
            senderAccount_row = mail_cur.fetchone()

            senderAccount = types.SimpleNamespace()
            setattr(senderAccount, "id", senderAccount_row[0])
            setattr(senderAccount, "login_user", senderAccount_row[1])
            setattr(senderAccount, "amountEmailsSend", senderAccount_row[2])
            #senderAccount = EmailAccount.objects.get(id=email.senderEmailAddress.id)

            SENDER = 'Tuyo.uy <' + str(senderAccount.login_user) + '>'
            RECIPIENT = email.receiverEmailAddress

            AWS_REGION = "us-east-1"

            SUBJECT = u''.join(email.subject).strip()
            SUBJECT = SUBJECT.replace('\n', ' ')
            message = u''.join(email.message).strip()
            # BODY_HTML = MIMEText(message, 'html', 'utf-8')
            # BODY_TEXT = (email.message).encode("UTF-8")
            BODY_TEXT = message
            CHARSET = "UTF-8"

            client = boto3client('ses', region_name=AWS_REGION, aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
                                  aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'))
            try:
                  # Provide the contents of the email.
                  response = client.send_email(
                        Destination={
                              'ToAddresses': [
                                    RECIPIENT,
                              ],
                        },
                        Message={
                              'Body': {
                                    'Html': {
                                          'Charset': CHARSET,
                                          'Data': BODY_TEXT,
                                    },
                                    'Text': {
                                          'Charset': CHARSET,
                                          'Data': BODY_TEXT,
                                    },
                              },
                              'Subject': {
                                    'Charset': CHARSET,
                                    'Data': SUBJECT,
                              },
                        },
                        Source=SENDER,
                        # If you are not using a configuration set, comment or delete the
                        # following line
                        # ConfigurationSetName=CONFIGURATION_SET,
                  )
            # Display an error if something goes wrong.
            except ClientError as e:
                  print("Client Error: " + str(e))
                  #email.error_desc = str(e)
                  email.tries += 1
                  #email.save()

                  mail_cur.execute("UPDATE mail_sender_service_email "
                                   "SET tries = %s, error_desc = %s WHERE id = %s",
                                   (email.tries, str(e), email.id))
            else:
                  #email.dateTimeSended = timezone.now()
                  #sent_state = Email_State.objects.get(id=2)  # State Enviado
                  #email._State = sent_state
                  email.tries += 1
                  #email.save()

                  mail_cur.execute("UPDATE mail_sender_service_email "
                                   "SET dateTimeSended = %s, _State_id = %s, tries = %s WHERE id = %s",
                                   (datetime.utcnow(), 2, email.tries, email.id))

                  senderAccount.amountEmailsSend += 1
                  #senderAccount.save()
                  mail_cur.execute("UPDATE mail_sender_service_emailaccount "
                                   "SET amountEmailsSend = %s WHERE id = %s",
                                   (senderAccount.amountEmailsSend, senderAccount.id))


      except Exception as e:
            print("Failed: " + str(e) + " email " + str(email.id))


run_single_action()
