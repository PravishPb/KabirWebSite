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

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('const TEXT = {') && !file.includes('Navbar.jsx')) { // Navbar is already done
    const componentName = path.basename(file, '.jsx');
    
    // 1. Remove TEXT object
    content = content.replace(/const\s+TEXT\s*=\s*({[\s\S]*?});[\n\r]*(?:export|const|function)/, (match, p1) => {
      // Return the trailing keyword that was matched
      return match.substring(match.lastIndexOf(match.match(/(?:export|const|function)/)[0]));
    });

    // 2. Add imports at top
    let importPaths = '';
    const depth = file.split(path.sep).length - srcDir.split(path.sep).length;
    const prefix = depth === 1 ? './' : '../';
    importPaths += `import { useApp } from '${prefix}context/AppContext';\n`;
    importPaths += `import { useTranslation } from '${prefix}locales/useTranslation';\n`;
    
    // Insert after last import
    const lastImportIndex = content.lastIndexOf('import ');
    const endOfLastImport = content.indexOf('\n', lastImportIndex);
    if (endOfLastImport !== -1) {
      content = content.slice(0, endOfLastImport + 1) + importPaths + content.slice(endOfLastImport + 1);
    } else {
      content = importPaths + content;
    }

    // 3. Update component signature and first lines
    // Find: export default function X({ lang = 'EN' }) {
    // Or: export default function X({ lang, toast }) {
    // Or: function X({ lang }) {
    
    // Using a regex to find the component function definition
    const funcRegex = new RegExp(`(?:export\\s+default\\s+)?function\\s+${componentName}\\s*\\([^)]*\\)\\s*\\{`);
    content = content.replace(funcRegex, (match) => {
      const isExportDefault = match.includes('export default');
      const prefix = isExportDefault ? 'export default ' : '';
      return `${prefix}function ${componentName}() {\n  const { lang, toast } = useApp();\n  const t = useTranslation('${componentName}');`;
    });

    // 4. Remove `const t = TEXT[lang] || TEXT.EN;`
    content = content.replace(/const\s+t\s*=\s*TEXT\[lang\]\s*\|\|\s*TEXT\.EN;\s*/, '');
    content = content.replace(/const\s+t\s*=\s*TEXT\[lang\];\s*/, '');
    
    // 5. Remove manual prop passing to children (lang={lang} toast={toast})
    // This is a bit aggressive but works for simple components
    content = content.replace(/\s+lang=\{lang\}/g, '');
    content = content.replace(/\s+toast=\{toast\}/g, '');
    content = content.replace(/\s+lang="EN"/g, '');

    fs.writeFileSync(file, content);
    console.log(`Refactored ${componentName}`);
  }
}
