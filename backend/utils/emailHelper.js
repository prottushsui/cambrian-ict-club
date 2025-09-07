const { exec } = require('child_process');
const path = require('path');

function sendWelcomeEmail(userData) {
  const scriptPath = path.join(__dirname, '../email_notifications.py');
  const cmd = `python3 ${scriptPath} welcome ${JSON.stringify(userData)}`;
  
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to send email:', error);
      return;
    }
    console.log('Email sent:', stdout);
  });
}

function sendVotingConfirmation(userData, poll, option) {
  const scriptPath = path.join(__dirname, '../email_notifications.py');
  const cmd = `python3 ${scriptPath} vote "${poll}" "${option}" ${JSON.stringify(userData)}`;
  
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to send email:', error);
      return;
    }
    console.log('Voting confirmation sent:', stdout);
  });
}

module.exports = { sendWelcomeEmail, sendVotingConfirmation };
