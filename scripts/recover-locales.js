import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

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

for (const file of allFiles) {
  const relPath = path.relative(path.resolve(__dirname, '..'), file).replace(/\\/g, '/');
  try {
    const oldContent = execSync(`git show HEAD:${relPath}`).toString();
    const textMatch = oldContent.match(/const\s+(?:TEXT|content)\s*=\s*({[\s\S]*?});[\n\r]*(?:export|const|function)/);
    
    if (textMatch) {
      const TEXT = eval('(' + textMatch[1] + ')');
      const componentName = path.basename(file, '.jsx');
      
      if (TEXT.EN) localeEN[componentName] = TEXT.EN;
      if (TEXT.HI) localeHI[componentName] = TEXT.HI;
    }
  } catch (e) {
    // some files might not have TEXT or might not be in HEAD yet
  }
}

// Add the ones currently in BlogPage (since it might have been committed or not, but git show HEAD has it if it was)
// Actually BlogPage was in HEAD. Let's just output it.
const localesDir = path.resolve(srcDir, 'locales');
fs.writeFileSync(path.join(localesDir, 'en.js'), `export default ${JSON.stringify(localeEN, null, 2)};\n`);
fs.writeFileSync(path.join(localesDir, 'hi.js'), `export default ${JSON.stringify(localeHI, null, 2)};\n`);
console.log('Recovered locales from git history!');
