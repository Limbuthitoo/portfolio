'use client';

import { useEffect, useState } from 'react';
import { SiteConfig } from '@/types';

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/config').then((r) => r.json()).then(setConfig);
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Enter your current password' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage(null);

    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Failed to change password' });
    }
    setPasswordSaving(false);
  };

  if (!config) return <p className="text-white/30 text-sm">Loading...</p>;

  const field = (label: string, key: keyof SiteConfig, type = 'text') => (
    <div key={key}>
      <label className="text-white/25 text-[9px] uppercase tracking-[0.25em] block mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={config[key] as string}
          onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
          className="w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/15 text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors resize-none"
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={config[key] as string}
          onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
          className="w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/15 text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors"
        />
      )}
    </div>
  );

  return (
    <div>
      <h1 className="text-white text-lg font-light mb-6">Settings</h1>
      <div className="max-w-2xl space-y-4">
        {field('Name', 'name')}
        {field('Title', 'title')}
        {field('Role', 'role')}
        {field('Description', 'description', 'textarea')}
        {field('Email', 'email')}
        {field('Location', 'location')}
        {field('Availability', 'availability')}

        <div>
          <label className="text-white/25 text-[9px] uppercase tracking-[0.25em] block mb-2">Social Links</label>
          <div className="space-y-2">
            {Object.entries(config.social).map(([platform, url]) => (
              <div key={platform} className="flex items-center gap-3">
                <span className="text-white/20 text-[9px] uppercase tracking-[0.2em] w-20">{platform}</span>
                <input
                  type="url"
                  value={url || ''}
                  onChange={(e) => setConfig({ ...config, social: { ...config.social, [platform]: e.target.value } })}
                  className="flex-1 bg-white/[0.03] border border-white/[0.06] focus:border-white/15 text-white text-sm px-3 py-2 rounded-lg outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button onClick={handleSave} disabled={saving}
            className="bg-white/[0.06] hover:bg-white/10 disabled:opacity-50 text-white text-[9px] uppercase tracking-[0.3em] px-6 py-2.5 rounded-lg transition-colors">
            {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Password Change */}
        <div className="pt-8 mt-8 border-t border-white/[0.06]">
          <h2 className="text-white/60 text-xs uppercase tracking-[0.25em] mb-4">Change Password</h2>
          <div className="space-y-3">
            <div>
              <label className="text-white/25 text-[9px] uppercase tracking-[0.25em] block mb-1.5">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/15 text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-white/25 text-[9px] uppercase tracking-[0.25em] block mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/15 text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-white/25 text-[9px] uppercase tracking-[0.25em] block mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/15 text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors"
              />
            </div>
            {passwordMessage && (
              <p className={`text-xs ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {passwordMessage.text}
              </p>
            )}
            <div className="pt-2">
              <button onClick={handlePasswordChange} disabled={passwordSaving}
                className="bg-white/[0.06] hover:bg-white/10 disabled:opacity-50 text-white text-[9px] uppercase tracking-[0.3em] px-6 py-2.5 rounded-lg transition-colors">
                {passwordSaving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
