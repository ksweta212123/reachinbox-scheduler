import React, { useEffect, useState } from 'react';

interface EmailJob {
  id: string;
  recipient: string;
  subject: string;
  status: 'Scheduled' | 'Sent' | 'Failed';
  scheduledAt: string;
}

export default function Dashboard() {
  const [emails, setEmails] = useState<EmailJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/emails');
      if (response.ok) {
        const data = await response.json();
        // Handle both raw arrays and wrapped objects (e.g. { success: true, emails: [...] })
        const emailList = Array.isArray(data) ? data : (data.emails || []);
        
        if (Array.isArray(emailList)) {
          setEmails(emailList);
        } else {
          setEmails([]);
        }
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 5000);
    return () => clearInterval(interval);
  }, []);

  const safeEmails = Array.isArray(emails) ? emails : [];

  const scheduledCount = safeEmails.filter(e => e.status === 'Scheduled').length;
  const sentCount = safeEmails.filter(e => e.status === 'Sent').length;
  const failedCount = safeEmails.filter(e => e.status === 'Failed').length;

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a8a', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
        ReachInbox Scheduler Dashboard
      </h2>
      
      {/* Metrics Grid */}
      <div style={{ display: 'flex', gap: '16px', margin: '20px 0' }}>
        <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#4b5563' }}>Scheduled</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706', margin: 0 }}>{scheduledCount}</p>
        </div>
        <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#4b5563' }}>Sent</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>{sentCount}</p>
        </div>
        <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#4b5563' }}>Failed</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>{failedCount}</p>
        </div>
      </div>

      {/* Email Tracking Table */}
      <h3 style={{ marginTop: '30px' }}>Email Logs</h3>
      {loading ? (
        <p>Loading email status...</p>
      ) : safeEmails.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No email jobs found. Start by composing or uploading a schedule!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Recipient</th>
              <th style={{ padding: '12px' }}>Subject</th>
              <th style={{ padding: '12px' }}>ScheduledFor</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {safeEmails.map((email) => (
              <tr key={email.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{email.recipient}</td>
                <td style={{ padding: '12px' }}>{email.subject}</td>
                <td style={{ padding: '12px' }}>{new Date(email.scheduledAt).toLocaleString()}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: email.status === 'Sent' ? '#16a34a' : email.status === 'Failed' ? '#dc2626' : '#d97706' }}>
                  {email.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
