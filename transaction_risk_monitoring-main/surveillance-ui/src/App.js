import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

function getRiskColor(score) {
  if (score >= 75) return '#dc2626';
  if (score >= 40) return '#d97706';
  return '#16a34a';
}

function getApprovalColor(status) {
  if (status === 'APPROVED') return '#16a34a';
  if (status === 'REJECTED') return '#dc2626';
  return '#d97706';
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter your username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const roles = ['CUSTOMER', 'MANAGER_1', 'MANAGER_2', 'MANAGER_3'];
      let loggedIn = false;
      for (const role of roles) {
        try {
          const res = await axios.post(`${API_URL}/api/auth/login`, { username, password, role });
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.role);
          localStorage.setItem('username', res.data.username);
          onLogin(res.data.role);
          loggedIn = true;
          break;
        } catch (e) {}
      }
      if (!loggedIn) setError('Invalid username or password. Please try again.');
    } catch (e) {
      setError('Invalid username or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0a1628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Arial, sans-serif", position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', top: '-100px', left: '-100px' }} />
      <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', bottom: '-200px', right: '-200px' }} />

      <div style={{ display: 'flex', width: '900px', minHeight: '550px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>

        {/* Left Panel */}
        <div style={{ flex: 1, background: 'linear-gradient(160deg, #1e40af 0%, #1d4ed8 40%, #0369a1 100%)', padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🏦</div>
              <div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '20px' }}>Finova Bank</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Transaction Surveillance</div>
              </div>
            </div>
            <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '700', lineHeight: '1.3', marginBottom: '16px' }}>Real-Time Transaction<br />Risk Monitoring System</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: '1.7' }}>Advanced surveillance engine that monitors transactions in real-time and detects suspicious activity instantly.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[{ icon: '🔒', text: 'Bank-grade Security' }, { icon: '⚡', text: 'Real-time Detection' }, { icon: '📊', text: 'Risk Score Analysis' }, { icon: '✅', text: 'Multi-level Approval' }].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{f.icon}</div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>{f.text}</span>
              </div>
            ))}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>© 2026 Finova Bank. All rights reserved.</div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '50px 45px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ color: '#0f172a', fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '35px' }}>Sign in to your Finova Bank account</p>
          {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px' }}>⚠️ {error}</div>}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#374151', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>👤</span>
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username"
                style={{ width: '100%', padding: '13px 14px 13px 42px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}
                onFocus={e => e.target.style.borderColor = '#1d4ed8'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ color: '#374151', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔑</span>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" onKeyPress={e => e.key === 'Enter' && handleLogin()}
                style={{ width: '100%', padding: '13px 42px 13px 42px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}
                onFocus={e => e.target.style.borderColor = '#1d4ed8'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px' }}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <button onClick={handleLogin} disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1d4ed8, #0369a1)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '20px' }}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In Securely'}
          </button>
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px' }}>🔒 Protected by 256-bit SSL encryption</p>
            <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Authorized personnel only. All access is monitored and logged.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerScreen({ username, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState({ fromAccount: '', toAccount: '', amount: '', transactionType: 'TRANSFER', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => { fetchTransactions(); fetchAccount(); }, []);

  const fetchAccount = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/accounts/my`, { headers: { 'X-Username': username } });
      setAccount(res.data);
      setForm(f => ({ ...f, fromAccount: res.data.accountNumber }));
    } catch (e) {}
  };

  const fetchTransactions = async () => {
    const res = await axios.get(`${API_URL}/api/transactions`, { headers: { 'X-Username': username, 'X-Role': 'CUSTOMER' } });
    setTransactions(res.data);
  };

  const handleSubmit = async () => {
    if (!form.fromAccount || !form.toAccount || !form.amount) {
      setMessage('Please fill all required fields');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/transactions`, form, { headers: { 'X-Username': username, 'X-Role': 'CUSTOMER' } });
      setMessage('Transaction submitted successfully!');
      setForm(f => ({ ...f, toAccount: '', amount: '', transactionType: 'TRANSFER', description: '' }));
      fetchTransactions();
      fetchAccount();
    } catch (e) {
      setMessage('Error submitting transaction. Please check your balance.');
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", padding: '20px', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1d4ed8', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>🏦</div>
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>Finova Bank</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Customer Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'white', fontWeight: '600' }}>👤 {username}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Customer Account</div>
          </div>
          <button onClick={onLogout} style={{ padding: '8px 18px', backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>
      </div>

      {/* Balance Card */}
      {account && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #1d4ed8' }}>
            <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>💰 Available Balance</div>
            <div style={{ color: '#1d4ed8', fontSize: '32px', fontWeight: '800' }}>₹{parseFloat(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Account Number: {account.accountNumber}</div>
          </div>
        </div>
      )}

      {/* Submit Transaction Form */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#1d4ed8', marginBottom: '20px', fontSize: '18px' }}>➕ Submit New Transaction</h2>
        {message && (
          <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '16px', backgroundColor: message.includes('success') ? '#f0fdf4' : '#fef2f2', color: message.includes('success') ? '#16a34a' : '#dc2626', border: `1px solid ${message.includes('success') ? '#bbf7d0' : '#fecaca'}` }}>
            {message.includes('success') ? '✅' : '❌'} {message}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ color: '#374151', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>From Account</label>
            <input value={form.fromAccount} disabled
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f8fafc', color: '#64748b' }} />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>To Account Number <span style={{ color: '#dc2626' }}>*</span></label>
            <input placeholder="Recipient account number" value={form.toAccount} onChange={e => setForm({ ...form, toAccount: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Amount (₹) <span style={{ color: '#dc2626' }}>*</span></label>
            <input placeholder="Enter amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div>
            <label style={{ color: '#374151', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Transaction Type</label>
            <select value={form.transactionType} onChange={e => setForm({ ...form, transactionType: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: 'white' }}>
              <option>TRANSFER</option>
              <option>WITHDRAWAL</option>
              <option>INTERNATIONAL</option>
              <option>CRYPTO</option>
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ color: '#374151', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
              📝 Description <span style={{ color: '#64748b', fontWeight: '400' }}>(Why are you making this transaction?)</span>
            </label>
            <textarea
              placeholder="e.g. Monthly rent payment, Salary transfer, Medical expenses, School fees..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
            />
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>ℹ️ Adding a description reduces risk score and speeds up approval</p>
          </div>
        </div>
        <button onClick={handleSubmit}
          style={{ marginTop: '20px', padding: '11px 28px', background: 'linear-gradient(135deg, #1d4ed8, #0369a1)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
          Submit Transaction →
        </button>
      </div>

      {/* My Transactions Table */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#1d4ed8', marginBottom: '20px', fontSize: '18px' }}>📋 My Transactions</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['ID', 'From', 'To', 'Amount', 'Type', 'Description', 'Risk Score', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>#{t.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{t.fromAccount}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}>{t.toAccount}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700' }}>₹{t.amount?.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontWeight: '600', fontSize: '12px' }}>{t.transactionType}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', maxWidth: '200px' }}>{t.description || <span style={{ color: '#e2e8f0' }}>No description</span>}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: getRiskColor(t.riskScore), padding: '4px 12px', borderRadius: '20px', color: 'white', fontWeight: '700', fontSize: '13px' }}>{t.riskScore}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: getApprovalColor(t.approvalStatus), padding: '4px 12px', borderRadius: '20px', color: 'white', fontWeight: '700', fontSize: '12px' }}>{t.approvalStatus}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No transactions found</p>}
        </div>
      </div>
    </div>
  );
}

function ManagerScreen({ username, role, onLogout }) {
  const [transactions, setTransactions] = useState([]);

  const managerLevel = role === 'MANAGER_1' ? '1' : role === 'MANAGER_2' ? '2' : '3';
  const amountRange = role === 'MANAGER_1' ? 'Amount < ₹1,000' : role === 'MANAGER_2' ? '₹1,000 – ₹10,000' : 'All Transactions';

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    const res = await axios.get(`${API_URL}/api/transactions`, { headers: { 'X-Username': username, 'X-Role': role } });
    setTransactions(res.data);
  };

  const handleApprove = async (id) => {
    await axios.put(`${API_URL}/api/transactions/${id}/approve`, {}, { headers: { 'X-Username': username, 'X-Role': role } });
    fetchTransactions();
  };

  const handleReject = async (id) => {
    await axios.put(`${API_URL}/api/transactions/${id}/reject`, {}, { headers: { 'X-Username': username, 'X-Role': role } });
    fetchTransactions();
  };

  const pending = transactions.filter(t => t.approvalStatus === 'PENDING').length;
  const approved = transactions.filter(t => t.approvalStatus === 'APPROVED').length;
  const escalated = transactions.filter(t => t.status === 'ESCALATED').length;

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", padding: '20px', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1e3a5f', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>🏦</div>
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>Finova Bank</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Risk Manager Portal — Level {managerLevel}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'white', fontWeight: '600' }}>🏦 {username}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{amountRange}</div>
          </div>
          <button onClick={onLogout} style={{ padding: '8px 18px', backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: '600' }}>Logout</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Transactions', value: transactions.length, color: '#1d4ed8', icon: '📊' },
          { label: 'Pending Review', value: pending, color: '#d97706', icon: '⏳' },
          { label: 'Approved', value: approved, color: '#16a34a', icon: '✅' },
          { label: 'Escalated', value: escalated, color: '#dc2626', icon: '🚨' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${card.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>{card.label}</span>
              <span style={{ fontSize: '20px' }}>{card.icon}</span>
            </div>
            <div style={{ color: card.color, fontSize: '32px', fontWeight: '800' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#1e3a5f', marginBottom: '20px', fontSize: '18px' }}>📋 Transaction Review Queue</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                {['ID', 'Customer', 'From', 'To', 'Amount', 'Type', 'Description', 'Risk Score', 'Risk Hint', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>#{t.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#1e3a5f' }}>{t.customerUsername}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{t.fromAccount}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px' }}>{t.toAccount}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700' }}>₹{t.amount?.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontWeight: '600', fontSize: '12px' }}>{t.transactionType}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', maxWidth: '150px' }}>{t.description || <span style={{ color: '#e2e8f0' }}>No description</span>}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: getRiskColor(t.riskScore), padding: '4px 12px', borderRadius: '20px', color: 'white', fontWeight: '700', fontSize: '13px' }}>{t.riskScore}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#d97706', maxWidth: '200px', fontWeight: '600' }}>{t.managerHint || '-'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                    <span style={{ backgroundColor: getApprovalColor(t.approvalStatus), padding: '4px 12px', borderRadius: '20px', color: 'white', fontWeight: '700', fontSize: '12px' }}>{t.approvalStatus}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {t.approvalStatus === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleApprove(t.id)}
                          style={{ padding: '6px 12px', backgroundColor: '#16a34a', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>✓ Approve</button>
                        <button onClick={() => handleReject(t.id)}
                          style={{ padding: '6px 12px', backgroundColor: '#dc2626', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>✗ Reject</button>
                      </div>
                    )}
                    {t.approvalStatus !== 'PENDING' && (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>by {t.approvedBy}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No transactions in queue</p>}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogin = (userRole) => {
    setRole(userRole);
    setUsername(localStorage.getItem('username'));
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    setUsername(null);
  };

  if (!role) return <LoginPage onLogin={handleLogin} />;
  if (role === 'CUSTOMER') return <CustomerScreen username={username} onLogout={handleLogout} />;
  return <ManagerScreen username={username} role={role} onLogout={handleLogout} />;
}

export default App;