const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const pool = new Pool({
  connectionString: 'postgres://postgres:password@localhost:5432/scheduler_db',
});

const initDb = async () => {
  try {
    const queryText = 'CREATE TABLE IF NOT EXISTS emails (' +
      'id SERIAL PRIMARY KEY, ' +
      'recipient VARCHAR(255) NOT NULL, ' +
      'subject VARCHAR(255) NOT NULL, ' +
      'body TEXT, ' +
      'scheduled_at TIMESTAMP NOT NULL, ' +
      'status VARCHAR(50) DEFAULT \'Scheduled\', ' +
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' +
      ');';
    
    await pool.query(queryText);
    console.log('Database table "emails" verified/created successfully.');
  } catch (err) {
    console.error('Error creating database table:', err.stack);
  }
};

const startBackgroundWorker = () => {
  setInterval(async () => {
    try {
      const dueQuery = 'SELECT id, recipient, subject, body FROM emails WHERE status = \'Scheduled\' AND scheduled_at <= NOW()';
      const result = await pool.query(dueQuery);

      if (result.rows.length > 0) {
        console.log('[Worker] Found ' + result.rows.length + ' due email(s) to dispatch.');
        
        for (const email of result.rows) {
          console.log('[Worker] Sending email to ' + email.recipient + ' | Subject: "' + email.subject + '"');

          await pool.query('UPDATE emails SET status = \'Sent\' WHERE id = ', [email.id]);
          console.log('[Worker] Email ID ' + email.id + ' marked as \'Sent\'.');
        }
      }
    } catch (err) {
      console.error('[Worker Error] Error processing scheduled emails:', err.stack);
    }
  }, 10000);
};

pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Connected to PostgreSQL Database at:', res.rows[0].now);
    await initDb();
    startBackgroundWorker();
  }
});

app.get('/api/emails', async (req, res) => {
  try {
    const queryText = 'SELECT id, recipient, subject, scheduled_at as "scheduledAt", status FROM emails ORDER BY created_at DESC';
    const result = await pool.query(queryText);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching emails from DB:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/schedule', async (req, res) => {
  try {
    const { recipient, subject, body, scheduledAt, emails } = req.body;

    let jobsToInsert = [];
    if (Array.isArray(emails) && emails.length > 0) {
      jobsToInsert = emails;
    } else if (recipient) {
      jobsToInsert = [{ recipient, subject, body, scheduledAt }];
    }

    if (jobsToInsert.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid email data provided.' });
    }

    for (const job of jobsToInsert) {
      const targetRecipient = job.recipient;
      const targetSubject = job.subject || subject || 'No Subject';
      const targetBody = job.body || body || '';
      const targetTime = job.scheduledAt || scheduledAt || new Date();

      await pool.query(
        'INSERT INTO emails (recipient, subject, body, scheduled_at, status) VALUES (, , , , \'Scheduled\')',
        [targetRecipient, targetSubject, targetBody, targetTime]
      );
    }

    console.log('Successfully saved ' + jobsToInsert.length + ' email job(s) to PostgreSQL!');
    return res.status(201).json({ success: true, message: 'Emails successfully scheduled and saved to database!' });
  } catch (error) {
    console.error('Error saving scheduled email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Backend server running on http://localhost:' + PORT);
});
