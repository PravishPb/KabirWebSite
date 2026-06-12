import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

const filesToProcess = ['AboutPage.jsx', 'TeachingsPage.jsx'];

const enFile = path.join(srcDir, 'locales/en.js');
const hiFile = path.join(srcDir, 'locales/hi.js');

let enDict = {};
let hiDict = {};

// We can just require or parse the existing JS file. But it has `export default`. 
// So we will parse it manually.
try {
  const enContent = fs.readFileSync(enFile, 'utf8').replace('export default ', '');
  enDict = eval('(' + enContent + ')');
  const hiContent = fs.readFileSync(hiFile, 'utf8').replace('export default ', '');
  hiDict = eval('(' + hiContent + ')');
} catch (e) { console.error("Error reading locales", e); }

for (const file of filesToProcess) {
  const filePath = path.join(srcDir, 'pages', file);
  let content = fs.readFileSync(filePath, 'utf8');
  const componentName = file.replace('.jsx', '');

  const textMatch = content.match(/const\s+content\s*=\s*({[\s\S]*?});[\n\r]*(?:export|const|function)/);
  if (textMatch) {
    try {
      const TEXT = eval('(' + textMatch[1] + ')');
      if (TEXT.EN) enDict[componentName] = TEXT.EN;
      if (TEXT.HI) hiDict[componentName] = TEXT.HI;

      // Refactor the file
      content = content.replace(/const\s+content\s*=\s*({[\s\S]*?});[\n\r]*/, '');
      
      const importPaths = `import { useApp } from '../context/AppContext';\nimport { useTranslation } from '../locales/useTranslation';\n`;
      const lastImportIndex = content.lastIndexOf('import ');
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + importPaths + content.slice(endOfLastImport + 1);

      content = content.replace(/export default function \w+\(\{\s*lang\s*\}\) \{/, `export default function ${componentName}() {\n  const { lang } = useApp();\n  const c = useTranslation('${componentName}');`);
      content = content.replace(/const\s+c\s*=\s*content\[lang\];\s*/, '');

      fs.writeFileSync(filePath, content);
      console.log(`Refactored ${componentName}`);
    } catch (e) {
      console.error(e);
    }
  }
}

fs.writeFileSync(enFile, `export default ${JSON.stringify(enDict, null, 2)};\n`);
fs.writeFileSync(hiFile, `export default ${JSON.stringify(hiDict, null, 2)};\n`);
console.log('Appended to locales!');
