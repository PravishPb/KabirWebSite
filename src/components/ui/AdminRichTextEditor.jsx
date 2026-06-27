import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle, FontFamily, FontSize, Color } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import Icon from './Icon';
import './AdminRichTextEditor.css';

// ─── Dynamic Google Fonts ────────────────────────────────────
// You can set VITE_GOOGLE_FONTS_API_KEY in your .env file
const GOOGLE_FONTS_API_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY || '';
const CACHE_KEY = 'rte_google_fonts_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Track loaded font stylesheets to avoid duplicate <link> tags
const loadedFontLinks = new Set();

function loadGoogleFont(fontName) {
  if (!fontName || loadedFontLinks.has(fontName)) return;
  loadedFontLinks.add(fontName);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

// Map Google's category names to user-friendly labels
const CATEGORY_LABELS = {
  'sans-serif': 'Sans-Serif',
  'serif': 'Serif',
  'display': 'Display',
  'handwriting': 'Handwriting',
  'monospace': 'Monospace',
};
const CATEGORY_ORDER = ['sans-serif', 'serif', 'monospace', 'display', 'handwriting'];

// Fallback font list (used when API is unavailable or key is missing)
const FALLBACK_FONTS = [
  { family: 'Cormorant Unicase', category: 'site' },
  { family: 'Merriweather Sans', category: 'site' },
  { family: 'Arial', category: 'sans-serif' },
  { family: 'Roboto', category: 'sans-serif' },
  { family: 'Open Sans', category: 'sans-serif' },
  { family: 'Lato', category: 'sans-serif' },
  { family: 'Montserrat', category: 'sans-serif' },
  { family: 'Poppins', category: 'sans-serif' },
  { family: 'Inter', category: 'sans-serif' },
  { family: 'Nunito', category: 'sans-serif' },
  { family: 'Raleway', category: 'sans-serif' },
  { family: 'Oswald', category: 'sans-serif' },
  { family: 'PT Sans', category: 'sans-serif' },
  { family: 'Ubuntu', category: 'sans-serif' },
  { family: 'Rubik', category: 'sans-serif' },
  { family: 'Work Sans', category: 'sans-serif' },
  { family: 'Quicksand', category: 'sans-serif' },
  { family: 'Barlow', category: 'sans-serif' },
  { family: 'Fira Sans', category: 'sans-serif' },
  { family: 'Mulish', category: 'sans-serif' },
  { family: 'Josefin Sans', category: 'sans-serif' },
  { family: 'Georgia', category: 'serif' },
  { family: 'Times New Roman', category: 'serif' },
  { family: 'Playfair Display', category: 'serif' },
  { family: 'Lora', category: 'serif' },
  { family: 'Merriweather', category: 'serif' },
  { family: 'PT Serif', category: 'serif' },
  { family: 'Noto Serif', category: 'serif' },
  { family: 'Libre Baskerville', category: 'serif' },
  { family: 'EB Garamond', category: 'serif' },
  { family: 'Crimson Text', category: 'serif' },
  { family: 'Bitter', category: 'serif' },
  { family: 'Spectral', category: 'serif' },
  { family: 'Roboto Slab', category: 'serif' },
  { family: 'Courier New', category: 'monospace' },
  { family: 'Roboto Mono', category: 'monospace' },
  { family: 'Source Code Pro', category: 'monospace' },
  { family: 'Fira Code', category: 'monospace' },
  { family: 'JetBrains Mono', category: 'monospace' },
  { family: 'Inconsolata', category: 'monospace' },
  { family: 'Dancing Script', category: 'handwriting' },
  { family: 'Pacifico', category: 'handwriting' },
  { family: 'Caveat', category: 'handwriting' },
  { family: 'Lobster', category: 'display' },
  { family: 'Bebas Neue', category: 'display' },
  { family: 'Abril Fatface', category: 'display' },
  { family: 'Comfortaa', category: 'display' },
  { family: 'Righteous', category: 'display' },
  { family: 'Anton', category: 'display' },
];

async function fetchGoogleFonts() {
  // Check sessionStorage cache first
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {}

  // Fetch from API if key is available
  if (GOOGLE_FONTS_API_KEY) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${GOOGLE_FONTS_API_KEY}`
      );
      if (res.ok) {
        const json = await res.json();
        const fonts = (json.items || []).map(f => ({ family: f.family, category: f.category }));
        // Cache result
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: fonts, timestamp: Date.now() }));
        } catch {}
        return fonts;
      }
    } catch (e) {
      console.warn("Failed to fetch Google Fonts API, using fallback list:", e);
    }
  }
  
  return FALLBACK_FONTS;
}

function groupFontsByCategory(fontList) {
  // Pin site fonts at the top
  const siteFonts = ['Cormorant Unicase', 'Merriweather Sans'];
  const groups = { 'Site Fonts': siteFonts.map(f => ({ family: f, category: 'site' })) };

  // Initialize ordered categories
  for (const cat of CATEGORY_ORDER) {
    groups[CATEGORY_LABELS[cat] || cat] = [];
  }
  
  // Group the rest by category
  for (const font of fontList) {
    if (siteFonts.includes(font.family)) continue; // already pinned
    
    // Some system fonts in fallback might not have a category match, default to sans-serif
    let label = CATEGORY_LABELS[font.category] || 'Other';
    // Handle standard system fonts manually if they lack a category
    if (font.family === 'Arial' || font.family === 'Helvetica') label = 'Sans-Serif';
    if (font.family === 'Georgia' || font.family === 'Times New Roman') label = 'Serif';
    if (font.family === 'Courier New') label = 'Monospace';

    if (!groups[label]) groups[label] = [];
    groups[label].push(font);
  }
  
  // Remove empty groups and sort alphabetically within groups
  const cleanGroups = {};
  for (const [groupName, fonts] of Object.entries(groups)) {
    if (fonts.length > 0) {
      cleanGroups[groupName] = fonts.sort((a, b) => a.family.localeCompare(b.family));
    }
  }
  return cleanGroups;
}

const FONT_SIZES = [
  { label: '8', value: '8px' },
  { label: '10', value: '10px' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '24', value: '24px' },
  { label: '28', value: '28px' },
  { label: '32', value: '32px' },
  { label: '36', value: '36px' },
  { label: '48', value: '48px' },
  { label: '64', value: '64px' },
  { label: '72', value: '72px' },
];

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
  '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
  '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
  '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
];

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      className={`rte-toolbar-btn ${active ? 'rte-toolbar-btn--active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="rte-toolbar-divider" />;
}

function ColorPicker({ colors, currentColor, onSelect, icon, title }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="rte-color-picker-wrap" ref={ref}>
      <button
        type="button"
        className="rte-toolbar-btn rte-color-trigger"
        onClick={() => setOpen(!open)}
        title={title}
      >
        <Icon name={icon} size={16} />
        <span className="rte-color-indicator" style={{ backgroundColor: currentColor || '#000' }} />
      </button>
      {open && (
        <div className="rte-color-dropdown">
          <div className="rte-color-grid">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`rte-color-swatch ${currentColor === c ? 'rte-color-swatch--active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => { onSelect(c); setOpen(false); }}
                title={c}
              />
            ))}
          </div>
          <button
            type="button"
            className="rte-color-reset"
            onClick={() => { onSelect(null); setOpen(false); }}
          >
            Reset to default
          </button>
        </div>
      )}
    </div>
  );
}

function EditorToolbar({ editor }) {
  const [fontGroups, setFontGroups] = useState({});

  useEffect(() => {
    // Fetch fonts and group them
    fetchGoogleFonts().then(fontList => {
      if (fontList) {
        const grouped = groupFontsByCategory(fontList);
        setFontGroups(grouped);
        
        // Preload fonts for the fallback list if API fails, or preload a subset 
        // to avoid freezing the browser if there are 1500+ fonts.
        // We will lazy load the rest when selected.
        const fontsToPreload = fontList.slice(0, 50).map(f => f.family);
        fontsToPreload.forEach(loadGoogleFont);
      }
    });
  }, []);

  if (!editor) return null;

  const currentFontFamily = editor.getAttributes('textStyle').fontFamily || '';
  const currentFontSize = editor.getAttributes('textStyle').fontSize || '';
  const currentColor = editor.getAttributes('textStyle').color || '';
  const currentHighlight = editor.getAttributes('highlight').color || '';

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="rte-toolbar">
      {/* Row 1: Font Family + Size + Heading */}
      <div className="rte-toolbar-row">
        <select
          className="rte-toolbar-select rte-font-family-select"
          value={currentFontFamily}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              loadGoogleFont(val);
              editor.chain().focus().setFontFamily(val).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          title="Font Family"
        >
          <option value="">Default</option>
          {Object.entries(fontGroups).map(([groupName, fonts]) => (
            <optgroup key={groupName} label={groupName}>
              {fonts.map(f => (
                <option key={f.family} value={f.family} style={{ fontFamily: f.family }}>
                  {f.family}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <select
          className="rte-toolbar-select rte-font-size-select"
          value={currentFontSize}
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontSize(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontSize().run();
            }
          }}
          title="Font Size"
        >
          <option value="">Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <ToolbarDivider />

        <select
          className="rte-toolbar-select rte-heading-select"
          value={
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' :
            editor.isActive('heading', { level: 4 }) ? '4' : '0'
          }
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          title="Heading Level"
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>
      </div>

      {/* Row 2: Formatting + Colors + Lists + Alignment + Link */}
      <div className="rte-toolbar-row">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Icon name="format_bold" size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Icon name="format_italic" size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <Icon name="format_underlined" size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Icon name="strikethrough_s" size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ColorPicker colors={COLORS} currentColor={currentColor} onSelect={(c) => c ? editor.chain().focus().setColor(c).run() : editor.chain().focus().unsetColor().run()} icon="format_color_text" title="Text Color" />
        <ColorPicker colors={COLORS} currentColor={currentHighlight} onSelect={(c) => c ? editor.chain().focus().setHighlight({ color: c }).run() : editor.chain().focus().unsetHighlight().run()} icon="format_color_fill" title="Highlight Color" />

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <Icon name="format_list_bulleted" size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
          <Icon name="format_list_numbered" size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <Icon name="format_align_left" size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <Icon name="format_align_center" size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <Icon name="format_align_right" size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
          <Icon name="format_align_justify" size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Insert Link">
          <Icon name="link" size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
          <Icon name="format_clear" size={16} />
        </ToolbarButton>
      </div>
    </div>
  );
}

export default function AdminRichTextEditor({ value, onChange, label, placeholder, disabled = false }) {
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      if (isUpdatingRef.current) return;
      const html = editor.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
  });

  // Update content if value changes externally (e.g. switching between blog items)
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML && value !== undefined) {
      isUpdatingRef.current = true;
      editor.commands.setContent(value || '', false);
      isUpdatingRef.current = false;
    }
  }, [value, editor]);

  // Toggle editable state
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  return (
    <div className={`admin-rich-text-editor ${disabled ? 'rte--disabled' : ''}`}>
      {label && <label className="admin-form-label">{label}</label>}
      <div className="rte-editor-wrap">
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} className="rte-content" />
      </div>
    </div>
  );
}
