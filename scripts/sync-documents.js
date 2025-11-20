const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const AdmZip = require('adm-zip');

const documentsDir = path.join(__dirname, '..', 'public', 'documents');
const sourceDir = process.env.DOCS_SOURCE_DIR;
const archiveUrl = process.env.DOCS_ARCHIVE_URL;

async function main() {
  if (!sourceDir && !archiveUrl) {
    console.log('No DOCS_SOURCE_DIR or DOCS_ARCHIVE_URL provided. Skipping document sync.');
    return;
  }

  ensureCleanDocumentsDir();

  if (sourceDir) {
    copyFromSourceDir(sourceDir);
  } else if (archiveUrl) {
    await extractFromArchive(archiveUrl);
  }

  flattenDocumentsDirectory();

  const pdfCount = countPDFs(documentsDir);
  console.log(`Document sync complete. ${pdfCount} PDF${pdfCount === 1 ? '' : 's'} available.`);
}

function ensureCleanDocumentsDir() {
  fs.rmSync(documentsDir, { recursive: true, force: true });
  fs.mkdirSync(documentsDir, { recursive: true });
}

function copyFromSourceDir(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`DOCS_SOURCE_DIR does not exist: ${dir}`);
  }

  fs.cpSync(dir, documentsDir, { recursive: true });
  console.log(`Copied documents from local source ${dir}`);
}

async function extractFromArchive(url) {
  const tempZipPath = path.join(os.tmpdir(), `drone-docs-${Date.now()}.zip`);
  await downloadArchive(url, tempZipPath);

  const zip = new AdmZip(tempZipPath);
  zip.extractAllTo(documentsDir, true);
  fs.rmSync(tempZipPath, { force: true });

  console.log(`Downloaded and extracted documents from ${url}`);
}

function flattenDocumentsDirectory() {
  if (!fs.existsSync(documentsDir)) {
    return;
  }

  const existingNames = new Set(fs.readdirSync(documentsDir));

  const ensureUniqueName = (name) => {
    if (!existingNames.has(name) && !fs.existsSync(path.join(documentsDir, name))) {
      existingNames.add(name);
      return name;
    }

    const parsed = path.parse(name);
    let counter = 1;
    let candidate;

    do {
      candidate = `${parsed.name}-${counter}${parsed.ext}`;
      counter += 1;
    } while (existingNames.has(candidate) || fs.existsSync(path.join(documentsDir, candidate)));

    existingNames.add(candidate);
    return candidate;
  };

  const movePdfs = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        movePdfs(fullPath);

        if (fullPath !== documentsDir && fs.existsSync(fullPath) && fs.readdirSync(fullPath).length === 0) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        }
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
        if (currentDir === documentsDir) {
          existingNames.add(entry.name);
          continue;
        }

        const destinationName = ensureUniqueName(entry.name);
        const destinationPath = path.join(documentsDir, destinationName);
        fs.renameSync(fullPath, destinationPath);
        console.log(`Flattened ${path.relative(documentsDir, fullPath)} -> ${destinationName}`);
      }
    }
  };

  movePdfs(documentsDir);
}

function countPDFs(dir) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  return fs.readdirSync(dir).filter((file) => file.toLowerCase().endsWith('.pdf')).length;
}

function buildHeaders() {
  const headers = {};

  if (process.env.DOCS_ARCHIVE_TOKEN) {
    const headerName = process.env.DOCS_ARCHIVE_AUTH_HEADER || 'Authorization';
    const scheme = process.env.DOCS_ARCHIVE_AUTH_SCHEME || 'Bearer';
    headers[headerName] = scheme ? `${scheme} ${process.env.DOCS_ARCHIVE_TOKEN}` : process.env.DOCS_ARCHIVE_TOKEN;
  }

  if (process.env.DOCS_ARCHIVE_BASIC_USER && process.env.DOCS_ARCHIVE_BASIC_PASS) {
    headers.Authorization = `Basic ${Buffer.from(
      `${process.env.DOCS_ARCHIVE_BASIC_USER}:${process.env.DOCS_ARCHIVE_BASIC_PASS}`
    ).toString('base64')}`;
  }

  if (process.env.DOCS_ARCHIVE_HEADER_KEY && process.env.DOCS_ARCHIVE_HEADER_VALUE) {
    headers[process.env.DOCS_ARCHIVE_HEADER_KEY] = process.env.DOCS_ARCHIVE_HEADER_VALUE;
  }

  return headers;
}

function downloadArchive(fileUrl, destinationPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error('Too many redirects while downloading document archive.'));
      return;
    }

    const url = new URL(fileUrl);
    const headers = buildHeaders();
    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: `${url.pathname}${url.search}`,
      method: 'GET',
      headers,
      timeout: 60_000
    };

    const client = url.protocol === 'https:' ? https : http;
    const request = client.request(requestOptions, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        resolve(downloadArchive(response.headers.location, destinationPath, redirectCount + 1));
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download archive. Status code: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(destinationPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });

      fileStream.on('error', (error) => {
        fs.rmSync(destinationPath, { force: true });
        reject(error);
      });
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy(new Error('Timeout while downloading document archive.'));
    });

    request.end();
  });
}

main().catch((error) => {
  console.error('Document sync failed:', error.message);
  process.exit(1);
});

