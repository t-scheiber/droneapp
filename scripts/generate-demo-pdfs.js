// Writes the fictional sample PDFs in public/demo-documents/.
// Run with `bun run generate-demo-pdfs` after changing the content below.
// The PDFs are built by hand (one page, Helvetica, no dependencies).
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'demo-documents');

const holder = [
  ['Name', 'Max Mustermann (fictional person)'],
  ['Address', 'Musterstrasse 1, 1010 Wien, Austria'],
  ['Date of birth', '01.01.1990'],
];

const documents = [
  {
    file: 'sample-drone-liability-insurance.pdf',
    title: 'SAMPLE - Drone liability insurance',
    subtitle: 'Certificate of insurance (fictional)',
    fields: [
      ['Insurer', 'Musterversicherung AG (does not exist)'],
      ['Policy number', 'DEMO-0000-0001'],
      ...holder,
      ['Aircraft', 'Example quadcopter, 249 g, serial DEMO-123'],
      ['Cover', 'Third-party liability, EUR 1,000,000 per event'],
      ['Valid from', '01.01.2026'],
      ['Valid until', '31.12.2026'],
    ],
  },
  {
    file: 'sample-operator-registration.pdf',
    title: 'SAMPLE - Drone operator registration',
    subtitle: 'UAS operator registration confirmation (fictional)',
    fields: [
      ['Issued by', 'Example Aviation Authority (does not exist)'],
      ['Operator number', 'AUT-DEMO-0000000'],
      ...holder,
      ['Category', 'Open category'],
      ['Registered on', '15.02.2026'],
      ['Valid until', '14.02.2031'],
    ],
  },
  {
    file: 'sample-remote-pilot-certificate.pdf',
    title: 'SAMPLE - Remote pilot certificate A1/A3',
    subtitle: 'Proof of online training and theory exam (fictional)',
    fields: [
      ['Issued by', 'Example Aviation Authority (does not exist)'],
      ['Certificate number', 'AUT-RP-DEMO-0001'],
      ...holder,
      ['Subcategories', 'A1 and A3'],
      ['Exam passed on', '20.02.2026'],
      ['Valid until', '19.02.2031'],
    ],
  },
];

function escapeText(text) {
  if (/[^\x20-\x7e]/.test(text)) {
    throw new Error(`Use ASCII only in demo PDF text: ${text}`);
  }
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function text(font, size, x, y, value) {
  return `BT /${font} ${size} Tf ${x} ${y} Td (${escapeText(value)}) Tj ET`;
}

function pageContent(doc) {
  const lines = [];

  // Large diagonal watermark behind everything else.
  const angle = Math.PI / 4;
  const c = Math.cos(angle).toFixed(4);
  const s = Math.sin(angle).toFixed(4);
  lines.push('0.88 g');
  lines.push(`BT /F2 110 Tf ${c} ${s} -${s} ${c} 170 230 Tm (SAMPLE) Tj ET`);

  // Red banner across the top.
  lines.push('0.75 0.1 0.1 rg');
  lines.push('0 792 m 612 792 l 612 750 l 0 750 l f');
  lines.push('1 g');
  lines.push(text('F2', 13, 40, 766, 'SAMPLE / DEMO DOCUMENT - FICTIONAL DATA - NOT VALID'));

  // Title block.
  lines.push('0 g');
  lines.push(text('F2', 20, 40, 700, doc.title));
  lines.push('0.3 g');
  lines.push(text('F1', 12, 40, 678, doc.subtitle));
  lines.push('0.6 G 1 w 40 662 m 572 662 l S');

  // Field table.
  let y = 630;
  for (const [label, value] of doc.fields) {
    lines.push('0.35 g');
    lines.push(text('F1', 11, 40, y, label));
    lines.push('0 g');
    lines.push(text('F2', 11, 190, y, value));
    y -= 24;
  }

  // Footer.
  lines.push('0.6 G 40 120 m 572 120 l S');
  lines.push('0.3 g');
  lines.push(text('F1', 9, 40, 100, 'This is a sample for the public demo of the drone document viewer.'));
  lines.push(text('F1', 9, 40, 86, 'Max Mustermann is a placeholder name. No real person, policy or registration is shown.'));
  lines.push(text('F1', 9, 40, 72, 'Source: github.com/t-scheiber/droneapp'));

  return lines.join('\n');
}

function buildPdf(doc) {
  const content = pageContent(doc);
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
    `<< /Title (${escapeText(doc.title)}) /Author (droneapp demo) /Subject (Fictional sample document) /Producer (scripts/generate-demo-pdfs.js) >>`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'latin1');
}

fs.mkdirSync(outputDir, { recursive: true });
for (const doc of documents) {
  fs.writeFileSync(path.join(outputDir, doc.file), buildPdf(doc));
  console.log(`Wrote public/demo-documents/${doc.file}`);
}
