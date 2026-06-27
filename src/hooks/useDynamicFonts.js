import { useEffect } from 'react';

/**
 * Custom hook to dynamically parse HTML content and load any Google Fonts 
 * specified in inline 'font-family' styles.
 * 
 * @param {string} htmlContent - The HTML content to parse
 */
export function useDynamicFonts(htmlContent) {
  useEffect(() => {
    if (!htmlContent) return;

    // Match inline font-family styles, e.g. font-family: "Dancing Script";
    const fontRegex = /font-family:\s*['"]?([^'";]+)['"]?/gi;
    let match;
    const fontsToLoad = new Set();
    
    while ((match = fontRegex.exec(htmlContent)) !== null) {
      const fontName = match[1].trim();
      
      // Skip standard system fonts and CSS keywords
      const systemFonts = [
        'inherit', 'Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Trebuchet MS', 
        'Courier New', 'Tahoma', 'Garamond', 'Palatino', 'Impact', 'Comic Sans MS', 
        'Lucida Console', 'Helvetica', 'sans-serif', 'serif', 'monospace',
        'Cormorant Unicase', 'Merriweather Sans' // Site fonts are already loaded in index.html
      ];
      
      if (!systemFonts.some(sys => sys.toLowerCase() === fontName.toLowerCase())) {
        fontsToLoad.add(fontName);
      }
    }
    
    fontsToLoad.forEach(fontName => {
      const linkId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
    });
  }, [htmlContent]);
}
