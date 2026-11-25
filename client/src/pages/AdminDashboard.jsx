import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  User, GraduationCap, Briefcase, FolderGit2, Award, Lock, Mail, Check,
  LogOut, Upload, Plus, Pencil, Trash2, Save, X, ChevronRight, ExternalLink, Eye
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toDateInput(d) {
  if (!d) return '';
  return new Date(d).toISOString().split('T')[0];
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
      <div className="toast" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(99,179,237,0.15)', border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(99,179,237,0.3)'}`, color: type === 'error' ? '#f87171' : 'var(--accent)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', backdropFilter: 'blur(10px)' }}>
      {msg}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label className="admin-label">{label}</label>
      {children}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ toast }) {
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);
  const fileRef = useRef(null);
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');

  useEffect(() => { api.get('/profile').then(r => setData(r.data)); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const cleaned = {
        ...data,
        skills: (data.skills || []).map(s => s.trim()).filter(Boolean),
        quickFacts: (data.quickFacts || [])
          .map(f => ({ label: (f.label || '').trim(), value: (f.value || '').trim() }))
          .filter(f => f.label && f.value),
        skillCategories: (data.skillCategories || [])
          .map(cat => ({
            title: (cat.title || '').trim(),
            subtitle: (cat.subtitle || '').trim(),
            items: (cat.items || []).map(s => s.trim()).filter(Boolean),
          }))
          .filter(cat => cat.title),
      };
      const r = await api.put('/profile', cleaned);
      setData(r.data);
      toast('Profile saved!', 'success');
    } catch { toast('Failed to save', 'error'); }
    finally { setSaving(false); }
  };

  const addSkillCategory = () => {
    setData(p => ({
      ...p,
      skillCategories: [...(p.skillCategories || []), { title: '', subtitle: '', items: [] }],
    }));
  };

  const updateSkillCategory = (idx, patch) => {
    setData(p => ({
      ...p,
      skillCategories: (p.skillCategories || []).map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }));
  };

  const removeSkillCategory = (idx) => {
    setData(p => ({
      ...p,
      skillCategories: (p.skillCategories || []).filter((_, i) => i !== idx),
    }));
  };

  const addQuickFact = () => {
    setData(p => ({
      ...p,
      quickFacts: [...(p.quickFacts || []), { label: '', value: '' }],
    }));
  };

  const updateQuickFact = (idx, patch) => {
    setData(p => ({
      ...p,
      quickFacts: (p.quickFacts || []).map((f, i) => (i === idx ? { ...f, ...patch } : f)),
    }));
  };

  const removeQuickFact = (idx) => {
    setData(p => ({
      ...p,
      quickFacts: (p.quickFacts || []).filter((_, i) => i !== idx),
    }));
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword) {
      toast('Please fill in both password fields', 'error');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast('New password must be at least 6 characters', 'error');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast('New passwords do not match', 'error');
      return;
    }
    setSavingPw(true);
    try {
      await api.put('/auth/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast('Admin password updated!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setSavingPw(false);
    }
  };

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append('photo', file);
    try {
      const r = await api.post('/profile/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setData(p => ({ ...p, photo: r.data.photo }));
      toast('Photo updated!', 'success');
    } catch { toast('Photo upload failed', 'error'); }
    finally { setUploadingPhoto(false); }
  };

  const photoSrc = data.photo ? (data.photo.startsWith('/uploads') ? `${apiBase}${data.photo}` : data.photo) : null;

  const inp = (field, type = 'text', placeholder = '') => (
    <input type={type} className="admin-input" value={data[field] || ''} placeholder={placeholder}
      onChange={e => setData(p => ({ ...p, [field]: e.target.value }))} />
  );

  return (
    <div>
      {/* Photo upload */}
      <div className="profile-photo-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', background: 'var(--bg-3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoSrc ? <img src={photoSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={32} color="var(--text-dim)" />}
        </div>
        <div>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Profile Photo</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>JPG or PNG · Max 10MB</p>
          <button onClick={() => fileRef.current?.click()} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }} disabled={uploadingPhoto}>
            <Upload size={14} /> {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
        </div>
      </div>

      <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}><FormRow label="Full Name">{inp('name', 'text', 'Ariyan Aftab')}</FormRow></div>
        <FormRow label="Professional Title">{inp('title', 'text', 'Full-Stack Developer & CSE Student')}</FormRow>
        <FormRow label="Location">{inp('location', 'text', 'Khulna, Bangladesh')}</FormRow>
        <div style={{ gridColumn: '1 / -1' }}>
          <FormRow label="Bio (Hero Summary)">
            <textarea className="admin-input" rows={3} value={data.bio || ''} placeholder="Write a short bio shown in Hero..."
              onChange={e => setData(p => ({ ...p, bio: e.target.value }))} style={{ resize: 'vertical' }} />
          </FormRow>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <FormRow label="About Me (Detailed — separate paragraphs with a blank line)">
            <textarea className="admin-input" rows={4} value={data.aboutText || ''} placeholder="Detailed story shown in the About Me section..."
              onChange={e => setData(p => ({ ...p, aboutText: e.target.value }))} style={{ resize: 'vertical' }} />
          </FormRow>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <label className="admin-label" style={{ marginBottom: 0 }}>About Me — Quick Snapshot Rows</label>
            <button type="button" onClick={addQuickFact} className="btn-ghost" style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}>
              <Plus size={14} /> Add Row
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {(data.quickFacts || []).map((fact, idx) => (
              <div key={fact._id || idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr auto', gap: '0.6rem', alignItems: 'center' }}>
                <input type="text" className="admin-input" value={fact.label || ''} onChange={e => updateQuickFact(idx, { label: e.target.value })} placeholder="Label (e.g. Currently Into)" />
                <input type="text" className="admin-input" value={fact.value || ''} onChange={e => updateQuickFact(idx, { value: e.target.value })} placeholder="Value (e.g. Full-Stack & Machine Learning)" />
                <button type="button" onClick={() => removeQuickFact(idx)} aria-label="Remove row" style={{ padding: '0.55rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <FormRow label="Email">{inp('email', 'email', 'you@example.com')}</FormRow>
        <FormRow label="Resume URL">{inp('resumeUrl', 'url', 'https://...')}</FormRow>
        <FormRow label="GitHub URL">{inp('github', 'url', 'https://github.com/...')}</FormRow>
        <FormRow label="LinkedIn URL">{inp('linkedin', 'url', 'https://linkedin.com/in/...')}</FormRow>
        <FormRow label="Twitter URL">{inp('twitter', 'url', 'https://twitter.com/...')}</FormRow>
        <FormRow label="Facebook URL">{inp('facebook', 'url', 'https://facebook.com/...')}</FormRow>
        <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label className="admin-label" style={{ marginBottom: 0 }}>Skill Categories (Shown as 2×2 Cards)</label>
            <button type="button" onClick={addSkillCategory} className="btn-ghost" style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}>
              <Plus size={14} /> Add Category
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
            {(data.skillCategories || []).map((cat, idx) => (
              <div key={cat._id || idx} style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={cat.title || ''}
                    onChange={e => updateSkillCategory(idx, { title: e.target.value })}
                    placeholder="Category title (e.g. ML, AI & Data Science)"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkillCategory(idx)}
                    aria-label="Remove category"
                    style={{ padding: '0.55rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', flexShrink: 0 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  className="admin-input"
                  value={cat.subtitle || ''}
                  onChange={e => updateSkillCategory(idx, { subtitle: e.target.value })}
                  placeholder="Short subtitle (optional)"
                />
                <input
                  type="text"
                  className="admin-input"
                  value={(cat.items || []).join(', ')}
                  onChange={e => updateSkillCategory(idx, { items: e.target.value.split(',') })}
                  placeholder="Skills in this category (comma separated: PyTorch, TensorFlow, Scikit-learn...)"
                />
              </div>
            ))}
            {!(data.skillCategories || []).length && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                No skill categories yet. Click &ldquo;Add Category&rdquo; to create one.
              </p>
            )}
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <FormRow label="Also Familiar With / Additional Skills (comma separated)">
            <input type="text" className="admin-input" value={(data.skills || []).join(', ')}
              onChange={e => setData(p => ({ ...p, skills: e.target.value.split(',') }))}
              placeholder="C, PHP, Laravel, NestJS, JavaFX, Plotly, Arduino..." />
          </FormRow>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <FormRow label="SEO Keywords">
            <input type="text" className="admin-input" value={data.seoKeywords || ''} placeholder="Ariyan Aftab, developer, KUET..."
              onChange={e => setData(p => ({ ...p, seoKeywords: e.target.value }))} />
          </FormRow>
        </div>
      </div>

      <button onClick={save} className="btn-primary" style={{ marginTop: '0.5rem' }} disabled={saving}>
        <Save size={14} /> {saving ? 'Saving...' : 'Save Profile'}
      </button>

      {/* Change Admin Password */}
      <form
        onSubmit={changePassword}
        style={{
          marginTop: '2.5rem',
          padding: '1.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
          <Lock size={16} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Change Admin Password</h3>
        </div>
        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <FormRow label="Current Password">
            <input
              type="password"
              className="admin-input"
              value={pwForm.currentPassword}
              onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
              placeholder="Current password"
              autoComplete="current-password"
            />
          </FormRow>
          <FormRow label="New Password">
            <input
              type="password"
              className="admin-input"
              value={pwForm.newPassword}
              onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
              placeholder="Min 6 characters"
              autoComplete="new-password"
            />
          </FormRow>
          <FormRow label="Confirm New Password">
            <input
              type="password"
              className="admin-input"
              value={pwForm.confirmPassword}
              onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </FormRow>
        </div>
        <button type="submit" className="btn-ghost" disabled={savingPw}>
          <Lock size={14} /> {savingPw ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

// ─── Education Tab ─────────────────────────────────────────────────────────────
function EducationTab({ toast }) {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | item
  const [form, setForm] = useState({});

  const load = () => api.get('/education').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ institution: '', degree: '', field: '', startYear: '', endYear: 'Present', grade: '', description: '', order: 0 }); setModal('add'); };
  const openEdit = (item) => { setForm({ ...item }); setModal(item); };
  const close = () => setModal(null);

  const save = async () => {
    try {
      if (modal === 'add') await api.post('/education', form);
      else await api.put(`/education/${form._id}`, form);
      await load();
      close();
      toast(modal === 'add' ? 'Education added!' : 'Education updated!', 'success');
    } catch { toast('Failed to save', 'error'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try { await api.delete(`/education/${id}`); await load(); toast('Deleted', 'success'); }
    catch { toast('Failed to delete', 'error'); }
  };

  const f = (field, type = 'text', placeholder = '') => (
    <input type={type} className="admin-input" value={form[field] || ''} placeholder={placeholder}
      onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Education ({items.length})</h2>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}><Plus size={14} /> Add Entry</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(item => (
          <div key={item._id} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{item.degree}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>{item.institution}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>{item.startYear} — {item.endYear}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => openEdit(item)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem', color: 'var(--text-muted)', cursor: 'pointer' }}><Pencil size={14} /></button>
              <button onClick={() => del(item._id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.4rem', color: '#f87171', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {!items.length && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>No education entries yet.</p>}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Education' : 'Edit Education'} onClose={close}>
          <FormRow label="Institution">{f('institution', 'text', 'KUET, Khulna University...')}</FormRow>
          <FormRow label="Degree">{f('degree', 'text', 'B.Sc. in Computer Science')}</FormRow>
          <FormRow label="Field / Major">{f('field', 'text', 'Computer Science and Engineering')}</FormRow>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormRow label="Start Year">{f('startYear', 'text', '2021')}</FormRow>
            <FormRow label="End Year">{f('endYear', 'text', 'Present')}</FormRow>
          </div>
          <FormRow label="Grade / GPA">{f('grade', 'text', '3.85/4.00')}</FormRow>
          <FormRow label="Description">
            <textarea className="admin-input" rows={3} value={form.description || ''} placeholder="Brief description..."
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
          </FormRow>
          <FormRow label="Display Order (lower = first)">{f('order', 'number', '0')}</FormRow>
          <div className="modal-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={save} className="btn-primary"><Save size={14} /> Save</button>
            <button onClick={close} className="btn-ghost">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Experience Tab ───────────────────────────────────────────────────────────
function ExperienceTab({ toast }) {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = () => api.get('/experience').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ company: '', role: '', type: 'Full-time', startDate: '', endDate: '', isCurrent: false, description: '', location: '', technologies: [], order: 0 });
    setModal('add');
  };
  const openEdit = (item) => {
    setForm({ ...item, startDate: toDateInput(item.startDate), endDate: toDateInput(item.endDate), technologies: item.technologies || [] });
    setModal(item);
  };
  const close = () => setModal(null);

  const save = async () => {
    try {
      const payload = { ...form };
      if (payload.isCurrent) payload.endDate = null;
      if (modal === 'add') await api.post('/experience', payload);
      else await api.put(`/experience/${form._id}`, payload);
      await load();
      close();
      toast(modal === 'add' ? 'Experience added!' : 'Experience updated!', 'success');
    } catch { toast('Failed to save', 'error'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try { await api.delete(`/experience/${id}`); await load(); toast('Deleted', 'success'); }
    catch { toast('Failed to delete', 'error'); }
  };

  const f = (field, type = 'text', placeholder = '') => (
    <input type={type} className="admin-input" value={form[field] || ''} placeholder={placeholder}
      onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
  );

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Experience ({items.length})</h2>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}><Plus size={14} /> Add Entry</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(item => (
          <div key={item._id} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <p style={{ fontWeight: 600 }}>{item.role}</p>
                {item.isCurrent && <span style={{ background: 'rgba(246,201,14,0.1)', border: '1px solid rgba(246,201,14,0.3)', color: 'var(--gold)', borderRadius: '100px', padding: '0.1rem 0.5rem', fontSize: '0.6rem', fontFamily: 'var(--font-mono)' }}>CURRENT</span>}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>{item.company}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                {formatDate(item.startDate)} — {item.isCurrent ? 'Present' : formatDate(item.endDate)} · {item.duration}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => openEdit(item)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem', color: 'var(--text-muted)', cursor: 'pointer' }}><Pencil size={14} /></button>
              <button onClick={() => del(item._id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.4rem', color: '#f87171', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {!items.length && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>No experience entries yet.</p>}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Experience' : 'Edit Experience'} onClose={close}>
          <FormRow label="Company">{f('company', 'text', 'Company Name')}</FormRow>
          <FormRow label="Role / Title">{f('role', 'text', 'Software Engineer')}</FormRow>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormRow label="Type">
              <select className="admin-input" value={form.type || 'Full-time'} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormRow>
            <FormRow label="Location">{f('location', 'text', 'Dhaka, Bangladesh')}</FormRow>
          </div>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormRow label="Start Date">{f('startDate', 'date')}</FormRow>
            <FormRow label="End Date">
              <input type="date" className="admin-input" value={form.endDate || ''} disabled={form.isCurrent}
                onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
            </FormRow>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
            <input type="checkbox" id="isCurrent" checked={form.isCurrent || false} onChange={e => setForm(p => ({ ...p, isCurrent: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }} />
            <label htmlFor="isCurrent" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>I currently work here</label>
          </div>
          <FormRow label="Description">
            <textarea className="admin-input" rows={3} value={form.description || ''} placeholder="What did you do here?"
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
          </FormRow>
          <FormRow label="Technologies (comma separated)">
            <input type="text" className="admin-input" value={(form.technologies || []).join(', ')}
              onChange={e => setForm(p => ({ ...p, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              placeholder="React, Node.js, MongoDB..." />
          </FormRow>
          <FormRow label="Display Order">{f('order', 'number', '0')}</FormRow>
          <div className="modal-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={save} className="btn-primary"><Save size={14} /> Save</button>
            <button onClick={close} className="btn-ghost">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────
function ProjectsTab({ toast }) {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = () => api.get('/projects').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ title: '', description: '', longDescription: '', thumbnail: '', liveUrl: '', githubUrl: '', technologies: [], category: 'Web', featured: false, status: 'completed', order: 0 });
    setModal('add');
  };
  const openEdit = (item) => { setForm({ ...item, technologies: item.technologies || [] }); setModal(item); };
  const close = () => setModal(null);

  const save = async () => {
    try {
      if (modal === 'add') await api.post('/projects', form);
      else await api.put(`/projects/${form._id}`, form);
      await load();
      close();
      toast(modal === 'add' ? 'Project added!' : 'Project updated!', 'success');
    } catch { toast('Failed to save', 'error'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await api.delete(`/projects/${id}`); await load(); toast('Deleted', 'success'); }
    catch { toast('Failed to delete', 'error'); }
  };

  const f = (field, type = 'text', placeholder = '') => (
    <input type={type} className="admin-input" value={form[field] || ''} placeholder={placeholder}
      onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>Projects ({items.length})</h2>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}><Plus size={14} /> Add Project</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
        {items.map(item => (
          <div key={item._id} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <p style={{ fontWeight: 600 }}>{item.title}</p>
                  {item.featured && <span style={{ background: 'rgba(246,201,14,0.1)', border: '1px solid rgba(246,201,14,0.3)', color: 'var(--gold)', borderRadius: '100px', padding: '0.1rem 0.5rem', fontSize: '0.6rem', fontFamily: 'var(--font-mono)' }}>FEATURED</span>}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.description.substring(0, 80)}{item.description.length > 80 ? '...' : ''}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
              {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}><ExternalLink size={13} /></a>}
              <button onClick={() => openEdit(item)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.35rem', color: 'var(--text-muted)', cursor: 'pointer' }}><Pencil size={13} /></button>
              <button onClick={() => del(item._id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '0.35rem', color: '#f87171', cursor: 'pointer' }}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {!items.length && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', gridColumn: '1/-1' }}>No projects yet.</p>}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Project' : 'Edit Project'} onClose={close}>
          <FormRow label="Title">{f('title', 'text', 'My Awesome Project')}</FormRow>
          <FormRow label="Short Description">
            <textarea className="admin-input" rows={2} value={form.description || ''} placeholder="What does this project do?"
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
          </FormRow>
          <FormRow label="Long Description (optional)">
            <textarea className="admin-input" rows={3} value={form.longDescription || ''} placeholder="More details..."
              onChange={e => setForm(p => ({ ...p, longDescription: e.target.value }))} style={{ resize: 'vertical' }} />
          </FormRow>
          <FormRow label="Thumbnail URL (optional)">{f('thumbnail', 'url', 'https://...')}</FormRow>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormRow label="Live URL (leave blank if none)">{f('liveUrl', 'url', 'https://...')}</FormRow>
            <FormRow label="GitHub URL">{f('githubUrl', 'url', 'https://github.com/...')}</FormRow>
          </div>
          <FormRow label="Technologies (comma separated)">
            <input type="text" className="admin-input" value={(form.technologies || []).join(', ')}
              onChange={e => setForm(p => ({ ...p, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
              placeholder="React, Node.js, MongoDB..." />
          </FormRow>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormRow label="Category">
              <select className="admin-input" value={form.category || 'Web'} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {['Web', 'Mobile', 'AI/ML', 'Desktop', 'CLI', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormRow>
            <FormRow label="Status">
              <select className="admin-input" value={form.status || 'completed'} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="archived">Archived</option>
              </select>
            </FormRow>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
            <input type="checkbox" id="featured" checked={form.featured || false} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }} />
            <label htmlFor="featured" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Mark as Featured</label>
          </div>
          <FormRow label="Display Order">{f('order', 'number', '0')}</FormRow>
          <div className="modal-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={save} className="btn-primary"><Save size={14} /> Save</button>
            <button onClick={close} className="btn-ghost">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Certificates Tab ─────────────────────────────────────────────────────────
function CertificatesTab({ toast }) {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');

  const load = () => api.get('/certificates').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ title: '', issuer: '', date: '', badge: '', team: '', description: '', image: '', credentialUrl: '', order: items.length });
    setModal('add');
  };
  const openEdit = (item) => { setForm({ ...item }); setModal(item); };
  const close = () => { setModal(null); setForm({}); };

  const resolveImg = (src) => {
    if (!src) return '';
    return src.startsWith('/uploads') ? `${apiBase}${src}` : src;
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/certificates/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(p => ({ ...p, image: res.data.image }));
      toast('Certificate image uploaded!');
    } catch {
      toast('Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    try {
      if (modal === 'add') {
        await api.post('/certificates', form);
        toast('Certificate added!');
      } else {
        await api.put(`/certificates/${modal._id}`, form);
        toast('Certificate updated!');
      }
      load();
      close();
    } catch {
      toast('Failed to save certificate', 'error');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this certificate?')) return;
    await api.delete(`/certificates/${id}`);
    toast('Deleted');
    load();
  };

  const f = (key, type = 'text', ph = '') => (
    <input type={type} className="admin-input" value={form[key] ?? ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} />
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{items.length} certificate{items.length !== 1 ? 's' : ''}</span>
        <button onClick={openAdd} className="btn-primary"><Plus size={15} /> Add Certificate</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map(cert => (
          <div key={cert._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
              {cert.image ? (
                <img src={resolveImg(cert.image)} alt={cert.title} style={{ width: '72px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '72px', height: '50px', borderRadius: '6px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <Award size={18} />
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cert.title}</span>
                  {cert.badge && <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '0.1rem 0.5rem', borderRadius: '100px' }}>{cert.badge}</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{cert.issuer}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                  {[cert.team, cert.date].filter(Boolean).join(' · ')}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => openEdit(cert)} style={{ padding: '0.45rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)' }}><Pencil size={14} /></button>
              <button onClick={() => del(cert._id)} style={{ padding: '0.45rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Certificate / Achievement' : 'Edit Certificate / Achievement'} onClose={close}>
          <FormRow label="Certificate Image">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
              {form.image && (
                <img src={resolveImg(form.image)} alt="Preview" style={{ width: '96px', height: '68px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
              )}
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} />
                <button type="button" onClick={() => fileRef.current.click()} disabled={uploading} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Image (Max 10MB)'}
                </button>
              </div>
            </div>
            {f('image', 'text', '/certificates/... or https://...')}
          </FormRow>
          <FormRow label="Title *">{f('title', 'text', 'National Datathon — CUET CSE Fest 2025')}</FormRow>
          <FormRow label="Issuer / Organizer *">{f('issuer', 'text', 'Department of CSE, CUET')}</FormRow>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormRow label="Badge / Award">{f('badge', 'text', 'Finalist · Datathon')}</FormRow>
            <FormRow label="Date / Year">{f('date', 'text', '2025')}</FormRow>
          </div>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormRow label="Team (optional)">{f('team', 'text', 'Team KUET_HEATWAVE')}</FormRow>
            <FormRow label="Display Order">{f('order', 'number', '0')}</FormRow>
          </div>
          <FormRow label="Description">
            <textarea className="admin-input" rows={3} value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Key highlight or achievement..." style={{ resize: 'vertical' }} />
          </FormRow>
          <FormRow label="Credential / Verify URL (optional)">{f('credentialUrl', 'url', 'https://...')}</FormRow>
          <div className="modal-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={save} className="btn-primary"><Save size={14} /> Save</button>
            <button onClick={close} className="btn-ghost">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────
function MessagesTab({ toast, onUnreadChange }) {
  const [items, setItems] = useState([]);

  const load = () => {
    api.get('/messages').then(r => {
      setItems(r.data);
      onUnreadChange?.(r.data.filter(m => !m.read).length);
    });
  };
  useEffect(() => { load(); }, []);

  const toggleRead = async (msg) => {
    try {
      await api.put(`/messages/${msg._id}/read`, { read: !msg.read });
      load();
    } catch {
      toast('Failed to update message', 'error');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast('Message deleted');
      load();
    } catch {
      toast('Failed to delete message', 'error');
    }
  };

  const unread = items.filter(m => !m.read).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {items.length} message{items.length !== 1 ? 's' : ''} {unread > 0 ? `· ${unread} unread` : ''}
        </span>
      </div>

      {!items.length ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          No messages yet. Visitors who submit your Contact form will appear here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {items.map(msg => (
            <div
              key={msg._id}
              style={{
                padding: '1.25rem 1.4rem',
                background: 'var(--surface)',
                border: `1px solid ${msg.read ? 'var(--border)' : 'var(--accent-border)'}`,
                borderRadius: 'var(--radius)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>{msg.subject}</span>
                    {!msg.read && (
                      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    <strong style={{ color: 'var(--text)' }}>{msg.name}</strong> ·{' '}
                    <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`} style={{ color: 'var(--accent)' }}>
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginRight: '0.35rem' }}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                  <button
                    onClick={() => toggleRead(msg)}
                    title={msg.read ? 'Mark as unread' : 'Mark as read'}
                    style={{ padding: '0.45rem 0.65rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', color: msg.read ? 'var(--text-dim)' : 'var(--emerald)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Check size={13} /> {msg.read ? 'Read' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => del(msg._id)}
                    title="Delete message"
                    style={{ padding: '0.45rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'messages', label: 'Messages', icon: Mail },
];

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [toast, setToast] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get('/messages').then(r => {
      setUnreadCount((r.data || []).filter(m => !m.read).length);
    }).catch(() => {});
  }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleLogout = () => { logout(); navigate('/admin'); };

  return (
    <>
      <Helmet>
        <title>Dashboard - Ariyan Aftab Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="admin-shell" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ width: '240px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>
            Portfolio <span style={{ color: 'var(--accent)' }}>Admin</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            @{admin?.username}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1.5rem', border: 'none', background: active ? 'var(--surface-2)' : 'transparent',
                color: active ? 'var(--text)' : 'var(--text-muted)', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                transition: 'all 0.2s',
              }}>
                <Icon size={16} />
                {t.label}
                {t.id === 'messages' && unreadCount > 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', background: 'var(--accent)', color: 'var(--bg)', padding: '0.05rem 0.45rem', borderRadius: '999px', fontWeight: 700 }}>
                    {unreadCount}
                  </span>
                )}
                {active && !(t.id === 'messages' && unreadCount > 0) && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--surface-2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Eye size={14} /> View Portfolio <ExternalLink size={11} style={{ marginLeft: 'auto' }} />
          </a>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="admin-main" style={{ flex: 1, marginLeft: '240px', padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {TABS.find(t => t.id === tab)?.label}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Manage your {tab} information
            </p>
          </div>

          {/* Tab content */}
          {tab === 'profile' && <ProfileTab toast={showToast} />}
          {tab === 'education' && <EducationTab toast={showToast} />}
          {tab === 'experience' && <ExperienceTab toast={showToast} />}
          {tab === 'projects' && <ProjectsTab toast={showToast} />}
          {tab === 'certificates' && <CertificatesTab toast={showToast} />}
          {tab === 'messages' && <MessagesTab toast={showToast} onUnreadChange={setUnreadCount} />}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
