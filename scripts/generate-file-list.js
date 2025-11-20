const fs = require('fs');
const path = require('path');

const documentsDir = path.join(__dirname, '..', 'public', 'documents');

// Create documents directory if it doesn't exist
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

const files = fs.readdirSync(documentsDir)
  .filter(file => file.endsWith('.pdf'))
  .map(file => {
    const fileName = file.replace('.pdf', '');
    const description = generateDescription(fileName);

    return {
      id: fileName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: formatFileName(fileName),
      description: description,
      file: `/documents/${file}`
    };
  });

function generateDescription(fileName) {
  const name = fileName.toLowerCase();

  // German terms recognition
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
  } else {
    return 'Documentation and reference materials';
  }
}

function formatFileName(fileName) {
  // Handle specific German filename patterns
  let formatted = fileName;

  // First, replace common abbreviations and terms with proper spacing
  formatted = formatted
    .replace(/austrocontrol/i, 'AustroControl')
    .replace(/austroControl/i, 'AustroControl')
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
    .replace(/air\&more/gi, 'AIR&MORE')
    .replace(/produktinformationsblatt/gi, 'Produktinformationsblatt')
    .replace(/ipid/gi, 'IPID')
    .replace(/&/g, ' & ');

  // Handle compound German words by adding spaces before capital letters
  // (except for common abbreviations and first letters)
  formatted = formatted
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

  // Clean up multiple spaces and normalize separators
  formatted = formatted
    .replace(/\s+/g, ' ')
    .replace(/[-_]+/g, ' ')
    .trim();

  // Split and format words with better handling
  return formatted
    .split(/\s+/)
    .map(word => {
      // Handle special cases
      if (word.match(/\d+\.\d+/) || word.includes('.')) {
        return word; // Keep version numbers and file extensions as-is
      }
      // Handle common patterns
      if (word.match(/^\d+$/)) {
        return word; // Keep standalone numbers
      }
      // Handle specific German terms that should remain as-is
      const keepAsIs = ['AustroControl', 'R+V', 'BBE', 'AE', 'AIR&MORE', 'IPID', 'LUFT'];
      if (keepAsIs.includes(word)) {
        return word;
      }
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

// Write the file list to a JSON file in the app directory
const outputPath = path.join(__dirname, '..', 'app', 'documents.json');
fs.writeFileSync(outputPath, JSON.stringify(files, null, 2));

console.log(`Generated file list for ${files.length} documents:`);
files.forEach(file => {
  console.log(`- ${file.name}: ${file.description}`);
});
