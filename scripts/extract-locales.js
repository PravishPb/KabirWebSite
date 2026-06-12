import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

// Recursively find all jsx files
function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.jsx')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allFiles = getFiles(srcDir);
const localeEN = {};
const localeHI = {};

let totalExtracted = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Basic regex to find the TEXT object. This matches: const TEXT = { EN: {...}, HI: {...} };
  const textMatch = content.match(/const\s+TEXT\s*=\s*({[\s\S]*?});[\n\r]*(?:export|const|function)/);
  if (textMatch) {
    try {
      // Evaluate the TEXT object string into an actual JS object
      // We use eval carefully since we know it's our own code
      let objStr = textMatch[1];
      // Clean up objStr if it has trailing stuff
      const TEXT = eval('(' + objStr + ')');
      
      const componentName = path.basename(file, '.jsx');
      
      if (TEXT.EN) localeEN[componentName] = TEXT.EN;
      if (TEXT.HI) localeHI[componentName] = TEXT.HI;
      totalExtracted++;
    } catch (e) {
      console.error(`Failed to parse TEXT in ${file}:`, e.message);
    }
  }
}

const localesDir = path.resolve(srcDir, 'locales');
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

fs.writeFileSync(path.join(localesDir, 'en.js'), `export default ${JSON.stringify(localeEN, null, 2)};\n`);
fs.writeFileSync(path.join(localesDir, 'hi.js'), `export default ${JSON.stringify(localeHI, null, 2)};\n`);

console.log(`Extracted texts from ${totalExtracted} files into src/locales/en.js and hi.js`);

