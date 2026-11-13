import fs from 'fs/promises';
import path from 'path';
import type { Role } from './session';

// Server-only. Real PDFs live outside public/, so Next.js never serves them
// as static files. The only way to read one is /api/documents/<file>, which
// requires an owner session.

export type DocumentEntry = {
  id: string;
  name: string;
  description: string;
  file: string;
};

export const REAL_DOCUMENTS_DIR = process.env.DOCS_DIR
  ? path.resolve(process.env.DOCS_DIR)
  : path.join(process.cwd(), 'private-documents');

// Fictional samples, committed in public/demo-documents/.
const DEMO_DOCUMENTS: DocumentEntry[] = [
  {
    id: 'sample-drone-liability-insurance',
    name: 'SAMPLE - Drone liability insurance',
    description: 'Fictional insurance certificate for Max Mustermann',
    file: '/demo-documents/sample-drone-liability-insurance.pdf',
  },
  {
    id: 'sample-operator-registration',
    name: 'SAMPLE - Drone operator registration',
    description: 'Fictional operator registration confirmation',
    file: '/demo-documents/sample-operator-registration.pdf',
  },
  {
    id: 'sample-remote-pilot-certificate',
    name: 'SAMPLE - Remote pilot certificate A1/A3',
    description: 'Fictional proof of the A1/A3 theory exam',
    file: '/demo-documents/sample-remote-pilot-certificate.pdf',
  },
];

async function realPdfFileNames(): Promise<string[]> {
  try {
    const entries = await fs.readdir(REAL_DOCUMENTS_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.pdf'))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

export async function listDocuments(role: Role): Promise<DocumentEntry[]> {
  if (role === 'demo') return DEMO_DOCUMENTS;

  const names = await realPdfFileNames();
  return names.map((fileName) => {
    const baseName = fileName.replace(/\.pdf$/i, '');
    return {
      id: baseName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: formatFileName(baseName),
      description: describe(baseName),
      file: `/api/documents/${encodeURIComponent(fileName)}`,
    };
  });
}

// Returns the absolute path only when the requested name is exactly one of the
// PDFs in the folder. The input never becomes part of a path otherwise.
export async function resolveRealDocument(requested: string): Promise<string | null> {
  const names = await realPdfFileNames();
  const match = names.find((name) => name === requested);
  return match ? path.join(REAL_DOCUMENTS_DIR, match) : null;
}

function describe(fileName: string): string {
  const name = fileName.toLowerCase();

  if (name.includes('invoice') || name.includes('rechnung') || name.includes('austrocontrol')) {
    return 'Official invoice and billing document';
  } else if (name.includes('haftpflicht') || name.includes('versicherung')) {
    return 'Liability insurance policy document';
  } else if (name.includes('luft') || name.includes('drohnen') || name.includes('drone')) {
    return 'Drone regulations and aviation documentation';
  } else if (name.includes('meldung') || name.includes('wechsel')) {
    return 'Drone registration and change notification';
  } else if (name.includes('bbe') || name.includes('air&more') || name.includes('ae')) {
    return 'Insurance certificate and coverage document';
  } else if (name.includes('manual') || name.includes('guide') || name.includes('handbuch')) {
    return 'User guide and documentation';
  } else if (name.includes('spec') || name.includes('technical') || name.includes('spezifikation')) {
    return 'Technical specifications and requirements';
  } else if (name.includes('install') || name.includes('installation')) {
    return 'Installation instructions and setup guide';
  } else if (name.includes('tutorial') || name.includes('anleitung')) {
    return 'Step-by-step tutorial and walkthrough';
  } else if (name.includes('faq') || name.includes('frage')) {
    return 'Frequently asked questions';
  } else if (name.includes('produkt') || name.includes('information')) {
    return 'Product information and documentation';
  }
  return 'Documentation and reference materials';
}

const KEEP_AS_IS = ['AustroControl', 'R+V', 'BBE', 'AE', 'AIR&MORE', 'IPID', 'LUFT'];

function formatFileName(fileName: string): string {
  let formatted = fileName
    .replace(/austrocontrol/i, 'AustroControl')
    .replace(/r\+v/gi, 'R+V')
    .replace(/bbe/gi, 'BBE')
    .replace(/ae/gi, 'AE')
    .replace(/drohnen/gi, 'Drohnen')
    .replace(/drone/gi, 'Drone')
    .replace(/haftpflicht/gi, 'Haftpflicht')
    .replace(/versicherung/gi, 'Versicherung')
    .replace(/meldung/gi, 'Meldung')
    .replace(/wechsel/gi, 'Wechsel')
    .replace(/luft/gi, 'LUFT')
    .replace(/invoice/gi, 'Invoice')
    .replace(/air&more/gi, 'AIR&MORE')
    .replace(/produktinformationsblatt/gi, 'Produktinformationsblatt')
    .replace(/ipid/gi, 'IPID')
    .replace(/&/g, ' & ');

  // Split compound words at case changes.
  formatted = formatted
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .replace(/[-_]+/g, ' ')
    .trim();

  return formatted
    .split(/\s+/)
    .map((word) => {
      if (/\d+\.\d+/.test(word) || word.includes('.')) return word;
      if (/^\d+$/.test(word)) return word;
      if (KEEP_AS_IS.includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
