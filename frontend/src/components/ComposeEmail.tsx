import React, { useState } from 'react';

export default function ComposeEmail() {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [bulkEmails, setBulkEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const extracted = content.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      setBulkEmails(extracted);
      alert('Loaded ' + extracted.length + ' emails from file for bulk scheduling!');
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      recipients: bulkEmails.length > 0 ? bulkEmails : [recipient],
      subject,
      body,
      scheduledAt
    };

    try {
      const response = await fetch('http://localhost:4000/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Emails successfully scheduled!');
        setRecipient('');
        setSubject('');
        setBody('');
        setScheduledAt('');
        setBulkEmails([]);
      } else {
        alert('Failed to schedule emails. Check backend connection.');
      }
    } catch (error) {
      console.error('Error submitting schedule:', error);
      alert('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Compose & Schedule Email</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Recipient Email (Single):</label>
          <input 
            type='email' 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)} 
            disabled={bulkEmails.length > 0}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            placeholder='client@example.com'
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Or Upload CSV / TXT (Bulk):</label>
          <input type='file' accept='.csv, .txt' onChange={handleFileUpload} />
          {bulkEmails.length > 0 && <p style={{ color: '#16a34a', fontSize: '14px', margin: '4px 0 0' }}>? {bulkEmails.length} recipients ready for bulk upload</p>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Subject:</label>
          <input 
            type='text' 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            placeholder='Campaign Subject'
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Email Body Content:</label>
          <textarea 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            required
            rows={4}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            placeholder='Write your email message here...'
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Schedule Date & Time:</label>
          <input 
            type='datetime-local' 
            value={scheduledAt} 
            onChange={(e) => setScheduledAt(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
          />
        </div>

        <button 
          type='submit' 
          disabled={loading}
          style={{ background: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          {loading ? 'Scheduling...' : 'Schedule Email'}
        </button>
      </form>
    </div>
  );
}
