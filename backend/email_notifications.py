import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl
import json
import sys
import argparse
from datetime import datetime

class EmailNotifier:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.port = 587
        self.sender_email = "ict-club@cambrian.edu"  # Change to your email
        self.password = "your-app-password"  # 16-digit app password

    def send_email(self, to_email, subject, body_html):
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.sender_email
            msg["To"] = to_email
            part = MIMEText(body_html, "html")
            msg.attach(part)
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                server.starttls(context=context)
                server.login(self.sender_email, self.password)
                server.sendmail(self.sender_email, to_email, msg.as_string())
            print(f"✅ Email sent to {to_email}")
            return True
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            return False

    def send_welcome_email(self, user_data):
        html = f"""
        <html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#8b5cf6,#ec4899);padding:30px;text-align:center;border-radius:10px 10px 0 0;">
        <h1 style="color:white;margin:0;">Welcome to ICT Club!</h1>
        </div>
        <div style="background:#f9fafb;padding:30px;border:1px solid #e5e7eb;border-top:none;">
        <p>Hi <strong>{user_data['name']}</strong>,</p>
        <p>Welcome to the Cambrian College ICT Club!</p>
        <ul style="background:#f3f4f6;padding:15px;border-radius:5px;">
        <li><strong>Email:</strong> {user_data['email']}</li>
        <li><strong>Campus ID:</strong> {user_data['campusId']}</li>
        <li><strong>Join Date:</strong> {datetime.now().strftime('%B %d, %Y')}</li>
        </ul>
        <p>Best,<br><strong>ICT Club Team</strong></p>
        </div></div></body></html>
        """
        return self.send_email(user_data['email'], "Welcome to Cambrian ICT Club!", html)

    def send_voting_confirmation(self, user_data, poll_title, option):
        html = f"""
        <html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);padding:30px;text-align:center;border-radius:10px 10px 0 0;">
        <h1 style="color:white;margin:0;">Vote Confirmed</h1>
        </div>
        <div style="background:#f9fafb;padding:30px;border:1px solid #e5e7eb;border-top:none;">
        <p>Hi <strong>{user_data['name']}</strong>,</p>
        <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:8px;padding:20px;">
        <h3 style="margin:0;color:#16a34a;">🗳️ Your Vote</h3>
        <p style="margin:10px 0 0 0;"><strong>Poll:</strong> {poll_title}</p>
        <p style="margin:0;"><strong>Choice:</strong> {option}</p>
        </div>
        <p>Thank you for participating!</p>
        <p>Best,<br><strong>ICT Club Team</strong></p>
        </div></div></body></html>
        """
        return self.send_email(user_data['email'], f"Vote Confirmed: {poll_title}", html)

def main():
    parser = argparse.ArgumentParser(description="Send emails for ICT Club")
    parser.add_argument('--action', choices=['welcome', 'vote'], required=True)
    parser.add_argument('--data', type=str, required=True)
    parser.add_argument('--poll', type=str, default="")
    parser.add_argument('--option', type=str, default="")

    args = parser.parse_args()
    user_data = json.loads(args.data.replace('\\"', '"'))
    notifier = EmailNotifier()

    if args.action == 'welcome':
        notifier.send_welcome_email(user_data)
    elif args.action == 'vote':
        notifier.send_voting_confirmation(user_data, args.poll, args.option)

if __name__ == "__main__":
    main()
