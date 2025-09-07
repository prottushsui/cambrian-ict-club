import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import os
import ssl
from datetime import datetime

class EmailNotifier:
    def __init__(self):
        # Gmail SMTP settings
        self.smtp_server = "smtp.gmail.com"
        self.port = 587
        self.sender_email = "yourclub@cambrian.edu"  # Use your Gmail
        self.password = "your-app-password"  # Get from Google App Passwords

    def send_email(self, to_email, subject, body_html):
        """Send email with HTML content"""
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.sender_email
            msg["To"] = to_email

            # Create HTML part
            part = MIMEText(body_html, "html")
            msg.attach(part)

            # Add SSL context
            context = ssl.create_default_context()
            
            # Connect and send
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                server.starttls(context=context)
                server.login(self.sender_email, self.password)
                server.sendmail(self.sender_email, to_email, msg.as_string())
            
            print(f"✅ Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            return False

    def send_welcome_email(self, user_data):
        """Send welcome email to new member"""
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">Welcome to ICT Club!</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                    <p>Hi <strong>{user_data['name']}</strong>,</p>
                    <p>Welcome to the Cambrian College ICT Club! We're excited to have you on board.</p>
                    
                    <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Your Membership Details</h3>
                    <ul style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <li><strong>Email:</strong> {user_data['email']}</li>
                        <li><strong>Campus ID:</strong> {user_data['campusId']}</li>
                        <li><strong>Join Date:</strong> {datetime.now().strftime('%B %d, %Y')}</li>
                    </ul>

                    <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Next Steps</h3>
                    <ol style="margin: 15px 0;">
                        <li>Log in to the <a href="http://localhost:5000">ICT Club Portal</a></li>
                        <li>Complete your profile</li>
                        <li>Join our upcoming events</li>
                    </ol>

                    <div style="background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>📅 Upcoming Event:</strong> Python Workshop on June 22, 2023 at 2:00 PM
                    </div>

                    <p>Need help? Contact the club administration at <a href="mailto:ict-club@cambrian.edu">ict-club@cambrian.edu</a></p>
                    
                    <p style="margin-top: 30px;">Best regards,<br><strong>ICT Club Team</strong><br>Cambrian College</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_data['email'], "Welcome to Cambrian ICT Club!", html)

    def send_voting_confirmation(self, user_data, poll_title, option):
        """Send voting confirmation email"""
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">Vote Confirmed</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                    <p>Hi <strong>{user_data['name']}</strong>,</p>
                    <p>This is a confirmation that your vote has been recorded successfully!</p>
                    
                    <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="margin: 0; color: #16a34a;">🗳️ Your Vote</h3>
                        <p style="margin: 10px 0 0 0;"><strong>Poll:</strong> {poll_title}</p>
                        <p style="margin: 0;"><strong>Choice:</strong> {option}</p>
                    </div>

                    <p>Thank you for participating in club decisions. Your voice matters!</p>
                    
                    <p style="margin-top: 30px;">Best regards,<br><strong>ICT Club Team</strong><br>Cambrian College</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_data['email'], f"Vote Confirmed: {poll_title}", html)

    def send_event_reminder(self, user_data, event_name, event_date, event_time):
        """Send event reminder email"""
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">Event Reminder</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                    <p>Hi <strong>{user_data['name']}</strong>,</p>
                    <p>This is a friendly reminder about an upcoming event you might be interested in:</p>
                    
                    <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="margin: 0; color: #16a34a;">{event_name}</h3>
                        <p style="margin: 10px 0;"><strong>Date:</strong> {event_date}</p>
                        <p style="margin: 0;"><strong>Time:</strong> {event_time}</p>
                    </div>

                    <p>We hope to see you there! Bring your laptop if it's a workshop.</p>
                    
                    <p style="margin-top: 30px;">Best regards,<br><strong>ICT Club Team</strong><br>Cambrian College</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_data['email'], f"Reminder: {event_name} Tomorrow", html)

# Example usage
if __name__ == "__main__":
    notifier = EmailNotifier()
    
    # Test user data
    user = {
        "name": "John Doe",
        "email": "johndoe@cambrian.edu",
        "campusId": "CJ6E001"
    }
    
    # Send welcome email
    notifier.send_welcome_email(user)
    
    # Send voting confirmation
    notifier.send_voting_confirmation(user, "Next Club President", "Alex Johnson")
    
    # Send event reminder
    notifier.send_event_reminder(user, "Python Workshop", "June 22, 2023", "2:00 PM")
