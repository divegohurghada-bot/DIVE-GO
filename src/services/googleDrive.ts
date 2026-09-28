import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

// IN-MEMORY TOKEN CACHE (Mandatory: never store in localStorage or sessionStorage)
let inMemoryAccessToken: string | null = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    inMemoryAccessToken = null;
  }
});

export const getCachedDriveToken = (): string | null => inMemoryAccessToken;

export const signInWithGoogleDrive = async (): Promise<{ user: User; token: string }> => {
  const provider = new GoogleAuthProvider();
  SCOPES.forEach((scope) => provider.addScope(scope));
  provider.setCustomParameters({ prompt: 'consent' });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken || null;

  if (!token) {
    throw new Error('Could not obtain Google Drive OAuth access token.');
  }

  inMemoryAccessToken = token;
  return { user: result.user, token };
};

export const signOutGoogleDrive = async (): Promise<void> => {
  inMemoryAccessToken = null;
  await signOut(auth);
};

export interface DriveUploadedFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
}

export const saveVoucherToGoogleDrive = async (
  voucherData: Record<string, any>
): Promise<DriveUploadedFile> => {
  if (!inMemoryAccessToken) {
    throw new Error('Not connected to Google Drive. Please sign in first.');
  }

  const fileName = `DiveGo_Hurghada_Voucher_${voucherData.bookingId || Date.now()}.txt`;
  const fileContent = `=========================================
DIVEGO HURGHADA - OFFICIAL BOOKING VOUCHER
=========================================
Booking ID: ${voucherData.bookingId || 'DGH-' + Date.now()}
Customer: ${voucherData.fullName}
WhatsApp/Phone: ${voucherData.whatsapp}
Email: ${voucherData.email}
Hotel Pickup: ${voucherData.hotelName} (Room: ${voucherData.roomNumber || 'TBD'})
Trip / Excursion: ${voucherData.tripTitle}
Date of Tour: ${voucherData.date}
Guests: ${voucherData.pax}
Payment Method: ${voucherData.paymentMethod}
Total Price: €${voucherData.totalPrice}

Cancellation Policy:
Free cancellation up to 24 hours prior to departure.

DiveGo Hurghada Contact:
Phone / WhatsApp: +2 0103 94 64 284
Email: divegohurghada@gmail.com
Location: Saqala Square, Hurghada First, Red Sea, Egypt
Website: https://www.divegohurghada.com/
=========================================`;

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
    description: 'DiveGo Hurghada official excursion voucher and itinerary',
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,createdTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${inMemoryAccessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Drive API error: ${res.status} ${errorText}`);
  }

  return await res.json();
};

export const listDiveGoDriveFiles = async (): Promise<DriveUploadedFile[]> => {
  if (!inMemoryAccessToken) {
    return [];
  }

  const query = encodeURIComponent("name contains 'DiveGo_Hurghada'");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,createdTime)&orderBy=createdTime desc`,
    {
      headers: {
        Authorization: `Bearer ${inMemoryAccessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to list Google Drive files: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
};
