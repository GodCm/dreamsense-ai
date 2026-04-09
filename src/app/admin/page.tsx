'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  createdAt: string;
  isSubscribed: boolean;
  subscriptionType: string | null;
  isBanned: boolean;
  banReason: string | null;
  isAdmin: boolean;
  _count: { dreams: number; payments: number };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Ban modal state
  const [banModal, setBanModal] = useState<{ userId: string; email: string } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banReasonType, setBanReasonType] = useState('preset'); // 'preset' or 'custom'
  const [selectedPreset, setSelectedPreset] = useState('');

  const BAN_PRESETS = [
    'Violation of Terms of Service',
    'Abusive or offensive behavior',
    'Spam or fraudulent activity',
    'Suspicious account activity',
    'Chargeback or payment dispute',
    'Inappropriate content',
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {
      setError('Failed to load users. Make sure you have admin access.');
    } finally {
      setLoading(false);
    }
  }, [page, search, router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleBan = async () => {
    if (!banModal) return;
    const finalReason = banReasonType === 'preset' ? selectedPreset : banReason.trim();
    setActionLoading(banModal.userId);
    try {
      const res = await fetch(`/api/admin/users/${banModal.userId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: finalReason || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to ban user');
        return;
      }
      setBanModal(null);
      setBanReason('');
      setBanReasonType('preset');
      setSelectedPreset('');
      await fetchUsers();
    } catch {
      alert('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (userId: string) => {
    if (!confirm('Unban this user?')) return;
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to unban user');
        return;
      }
      await fetchUsers();
    } catch {
      alert('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-1">Admin Dashboard</h1>
          <p className="text-text-secondary">Manage users — ban or unban accounts</p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-surface border border-border rounded-lg px-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
          />
          <button
            onClick={fetchUsers}
            className="px-5 py-2 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Email</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Joined</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Subscription</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Dreams</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Status</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-secondary">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-secondary">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-background/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary">{user.email}</span>
                        {user.isAdmin && (
                          <span className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">Admin</span>
                        )}
                      </div>
                      {user.isBanned && user.banReason && (
                        <p className="text-xs text-red-400 mt-0.5">Reason: {user.banReason}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {user.isSubscribed ? (
                        <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full">
                          {user.subscriptionType || 'Subscribed'}
                        </span>
                      ) : (
                        <span className="text-text-secondary text-xs">Free</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{user._count.dreams}</td>
                    <td className="px-4 py-3">
                      {user.isBanned ? (
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">Banned</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!user.isAdmin && (
                        user.isBanned ? (
                          <button
                            onClick={() => handleUnban(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-xs px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === user.id ? '...' : 'Unban'}
                          </button>
                        ) : (
                          <button
                            onClick={() => setBanModal({ userId: user.id, email: user.email })}
                            disabled={actionLoading === user.id}
                            className="text-xs px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                          >
                            Ban
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-text-secondary text-sm">
              {pagination.total} users total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-text-primary disabled:opacity-40 hover:border-accent transition-colors"
              >
                ← Prev
              </button>
              <span className="px-3 py-1.5 text-sm text-text-secondary">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-text-primary disabled:opacity-40 hover:border-accent transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ban Modal */}
      {banModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-text-primary mb-2">Ban User</h2>
            <p className="text-text-secondary text-sm mb-4">
              Banning <span className="text-text-primary font-medium">{banModal.email}</span> will prevent them from logging in.
            </p>

            {/* Reason type toggle */}
            <div className="flex gap-1 mb-3 bg-background rounded-lg p-1">
              <button
                onClick={() => setBanReasonType('preset')}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  banReasonType === 'preset' ? 'bg-accent text-background' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Preset Reason
              </button>
              <button
                onClick={() => setBanReasonType('custom')}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  banReasonType === 'custom' ? 'bg-accent text-background' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Custom Reason
              </button>
            </div>

            {/* Preset options */}
            {banReasonType === 'preset' && (
              <div className="mb-5">
                <label className="block text-sm text-text-secondary mb-2">Select a reason</label>
                <div className="space-y-1.5">
                  {BAN_PRESETS.map((preset) => (
                    <label
                      key={preset}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer border transition-colors ${
                        selectedPreset === preset
                          ? 'bg-red-500/10 border-red-500/40 text-red-400'
                          : 'bg-background border-border text-text-primary hover:border-accent/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="banPreset"
                        value={preset}
                        checked={selectedPreset === preset}
                        onChange={() => setSelectedPreset(preset)}
                        className="accent-red-500"
                      />
                      <span className="text-sm">{preset}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Custom input */}
            {banReasonType === 'custom' && (
              <div className="mb-5">
                <label className="block text-sm text-text-secondary mb-1.5">
                  Reason
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter the reason for banning this user..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent resize-none text-sm"
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setBanModal(null); setBanReason(''); setBanReasonType('preset'); setSelectedPreset(''); }}
                className="px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary border border-border hover:border-border/80 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleBan}
                disabled={!!actionLoading || (banReasonType === 'preset' && !selectedPreset)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {actionLoading ? 'Banning...' : 'Confirm Ban'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
