import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  Cloud,
  CheckCircle2,
  FileText,
  ExternalLink,
  LogOut,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import {
  signInWithGoogleDrive,
  signOutGoogleDrive,
  saveVoucherToGoogleDrive,
  listDiveGoDriveFiles,
  DriveUploadedFile,
  auth,
} from '../../services/googleDrive';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useLanguage } from '../../context/LanguageContext';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingToBackup?: Record<string, any> | null;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  bookingToBackup,
}) => {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [files, setFiles] = useState<DriveUploadedFile[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        loadDriveFiles();
      } else {
        setFiles([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadDriveFiles = async () => {
    try {
      const list = await listDiveGoDriveFiles();
      setFiles(list);
    } catch (e: any) {
      console.warn('Could not load drive files', e);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { user } = await signInWithGoogleDrive();
      setCurrentUser(user);
      setStatusMessage(`Connected as ${user.email}`);
      await loadDriveFiles();

      // If there is an active booking to backup, backup immediately
      if (bookingToBackup) {
        await handleBackupBooking(bookingToBackup);
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to connect to Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutGoogleDrive();
      setCurrentUser(null);
      setFiles([]);
      setStatusMessage('Disconnected from Google Drive.');
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const handleBackupBooking = async (data?: Record<string, any>) => {
    setSyncing(true);
    setErrorMessage(null);
    try {
      const payload = data || {
        bookingId: 'DGH-' + Math.floor(100000 + Math.random() * 900000),
        fullName: currentUser?.displayName || 'Guest Diver',
        whatsapp: '+201039464284',
        email: currentUser?.email || 'guest@divegohurghada.com',
        hotelName: 'Hurghada Resort',
        roomNumber: '102',
        tripTitle: 'Daily Boat Diving (2 Guided Dives) & Dolphin Encounter',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        pax: 2,
        paymentMethod: 'Cash on Arrival',
        totalPrice: 130,
      };

      const result = await saveVoucherToGoogleDrive(payload);
      setStatusMessage(`Voucher "${result.name}" saved to Google Drive!`);
      await loadDriveFiles();
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to upload voucher to Google Drive.');
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{t.drive.title}</h3>
              <p className="text-xs text-slate-400">Backup vouchers & itineraries to your Google account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-950/80 border border-red-800/80 text-red-300 flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          {!currentUser ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400">
                <Cloud className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Save Dive Vouchers to Google Drive</h4>
                <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Sign in with Google to automatically backup your confirmed excursions, permits, and tickets directly to your personal Drive.
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="inline-flex items-center justify-center space-x-3 px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold shadow-md transition cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{loading ? 'Connecting...' : t.drive.connectGoogle}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Account Card */}
              <div className="flex items-center justify-between p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                <div className="flex items-center space-x-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || ''}
                      className="h-10 w-10 rounded-full border border-cyan-500/40"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 font-bold">
                      {currentUser.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-white block">{currentUser.displayName || 'Google User'}</span>
                    <span className="text-[11px] text-slate-400 block">{currentUser.email}</span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 rounded-xl transition cursor-pointer"
                  title="Disconnect Drive"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => handleBackupBooking(bookingToBackup || undefined)}
                  disabled={syncing}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-md transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : t.drive.backupVouchers}</span>
                </button>
              </div>

              {/* Uploaded Files in Drive */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Synced Vouchers on Google Drive ({files.length})
                </span>

                {files.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-slate-400">
                    No vouchers backed up to Drive yet. Click above to sync your latest trip.
                  </div>
                ) : (
                  <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition"
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span className="text-white truncate font-medium">{file.name}</span>
                        </div>
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-cyan-400 transition"
                            title="Open in Google Drive"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Google Drive OAuth 2.0 Certified</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
