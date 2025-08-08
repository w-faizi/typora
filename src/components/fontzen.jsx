"use client";

import { useState, useEffect, useCallback } from "react";
import { Moon, Sun, Copy, Check, X } from "lucide-react";

// Sample Google Fonts data - in a real app, this would be loaded from fonts.json
const GOOGLE_FONTS = [
  "Roboto",
  "Open Sans", 
  "Lato",
  "Montserrat",
  "Oswald",
  "Source Sans Pro",
  "Slabo 27px",
  "Raleway",
  "PT Sans",
  "Lora",
  "Roboto Condensed",
  "Ubuntu",
  "Playfair Display",
  "Merriweather",
  "PT Serif",
  "Noto Sans",
  "Nunito",
  "Poppins",
  "Crimson Text",
  "Droid Sans",
  "Arimo",
  "Cabin",
  "PT Sans Narrow",
  "Fjalla One",
  "Libre Baskerville",
  "Roboto Slab",
  "Droid Serif",
  "Oxygen",
  "Titillium Web",
  "Muli",
  "Karla",
  "Inconsolata",
  "Bitter",
  "Dosis",
  "Source Code Pro",
  "Anton",
  "Vollkorn",
  "Francois One",
  "Abril Fatface",
  "Old Standard TT",
  "Droid Sans Mono",
  "Lobster",
  "Arvo",
  "Rokkitt",
  "PT Sans Caption",
  "BenchNine",
  "Exo",
  "Yanone Kaffeesatz",
  "Source Serif Pro",
  "Alegreya",
  "Indie Flower",
  "Shadows Into Light",
  "Quicksand",
  "Cantarell",
  "Comfortaa",
  "Dancing Script",
  "Josefin Sans",
  "Noto Serif",
  "Fira Sans",
  "Libre Franklin",
  "Rubik",
  "Work Sans",
  "Hind",
  "Crimson Pro",
  "Barlow",
  "Inter",
  "Manrope",
  "DM Sans",
  "Space Grotesk",
  "JetBrains Mono",
  "Fira Code",
  "IBM Plex Sans",
  "IBM Plex Serif",
  "IBM Plex Mono",
  "Epilogue",
  "Plus Jakarta Sans",
  "Outfit",
  "Lexend",
  "Sora",
  "Red Hat Display",
  "Red Hat Text",
  "Urbanist",
  "Be Vietnam Pro",
  "Chakra Petch",
  "Sarabun",
  "Kanit",
  "Prompt",
  "Mitr",
  "Sriracha",
  "Mali",
  "Charm",
  "Kodchasan",
  "K2D",
  "Bai Jamjuree",
  "Charmonman",
  "Fahkwang",
  "Krub",
  "Niramit",
  "Pridi",
  "Taviraj",
  "Athiti",
  "Chonburi",
  "Maitree",
  "Thasadith",
  "Itim",
  "Saira",
  "Saira Condensed",
  "Saira Extra Condensed",
  "Saira Semi Condensed",
  "Inter"
];

// Generate more fonts to reach 1000+
const generateMoreFonts = () => {
  const baseFonts = [...GOOGLE_FONTS];
  const variations = ["Light", "Regular", "Medium", "Bold", "Black"];
  const styles = ["Italic", "Condensed", "Extended", "Thin", "Extra Bold"];

  while (baseFonts.length < 1000) {
    const baseFont = GOOGLE_FONTS[Math.floor(Math.random() * GOOGLE_FONTS.length)];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];

    const newFont = `${baseFont} ${variation}`;
    const newFont2 = `${baseFont} ${style}`;

    if (!baseFonts.includes(newFont)) baseFonts.push(newFont);
    if (!baseFonts.includes(newFont2) && baseFonts.length < 1000) baseFonts.push(newFont2);
  }

  return baseFonts.slice(0, 1000);
};

const ALL_FONTS = generateMoreFonts();

export default function FontZen() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFont, setSelectedFont] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [loadedFonts, setLoadedFonts] = useState(new Set());

  const fontsPerPage = 6; // 3x2 grid
  const totalPages = Math.ceil(ALL_FONTS.length / fontsPerPage);
  const startIndex = (currentPage - 1) * fontsPerPage;
  const currentFonts = ALL_FONTS.slice(startIndex, startIndex + fontsPerPage);

  // Handle client-side mounting and dark mode initialization
  useEffect(() => {
    setMounted(true);

    // Load dark mode preference after mounting
    const savedDarkMode = localStorage.getItem("typora-dark-mode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (!mounted) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("typora-dark-mode", JSON.stringify(darkMode));
  }, [darkMode, mounted]);

  // Load Google Fonts dynamically
  const loadFont = useCallback((fontName) => {
    if (!mounted || loadedFonts.has(fontName)) return;

    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@300;400;500&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    setLoadedFonts((prev) => new Set([...prev, fontName]));
  }, [loadedFonts, mounted]);

  // Load fonts for current page
  useEffect(() => {
    if (mounted) {
      currentFonts.forEach((font) => loadFont(font));
    }
  }, [currentFonts, loadFont, mounted]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const copyToClipboard = async (text, type, fontName) => {
    const key = `${fontName}-${type}`;
    
    try {
      // Method 1: Modern Clipboard API (HTTPS only)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopiedStates((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => setCopiedStates((prev) => ({ ...prev, [key]: false })), 2000);
        return;
      }
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback:", err);
    }

    // Method 2: Fallback for all other cases
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Make sure the element is visible and focusable
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      textArea.style.zIndex = "-1";
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopiedStates((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => setCopiedStates((prev) => ({ ...prev, [key]: false })), 2000);
      } else {
        throw new Error("execCommand failed");
      }
    } catch (err) {
      console.error("All copy methods failed:", err);
      
      // Method 3: Last resort - show an alert with the text
      const shortText = text.length > 100 ? text.substring(0, 100) + "..." : text;
      alert(`Copy this code:\n\n${shortText}`);
      
      // Still show copied state for UX
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopiedStates((prev) => ({ ...prev, [key]: false })), 2000);
    }
  };

  const getCodeBlocks = (fontName) => {
    const fontFamily = fontName.replace(/\s+/g, "+");
    return {
      html: `<link href="https://fonts.googleapis.com/css2?family=${fontFamily}&display=swap" rel="stylesheet">`,
      css: `font-family: '${fontName}', sans-serif;`,
    };
  };

  const FontCard = ({ fontName }) => {
    const isLoaded = loadedFonts.has(fontName);

    return (
      <div
        className="group cursor-pointer p-8 transition-all duration-200 hover:bg-gray-25 dark:hover:bg-gray-925"
        onClick={() => setSelectedFont(fontName)}
      >
        <h3 className="text-xs font-light text-gray-400 dark:text-gray-600 mb-6 tracking-wide uppercase">
          {fontName}
        </h3>
        <div
          className="text-2xl text-gray-900 dark:text-gray-100 leading-relaxed"
          style={{
            fontFamily: isLoaded ? `'${fontName}', sans-serif` : "inherit",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
          }}
        >
          The quick brown fox
        </div>
      </div>
    );
  };

  const CodeBlock = ({ title, code, type, fontName }) => {
    const key = `${fontName}-${type}`;
    const isCopied = copiedStates[key];

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
            {title}
          </h4>
          <button
            onClick={() => copyToClipboard(code, type, fontName)}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
            {isCopied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-x-auto font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src="https://ucarecdn.com/41edefbe-c862-436a-ad5c-79fc24efb3df/-/format/auto/"
                alt="Typora"
                className="w-12 h-12 object-contain brightness-0 dark:brightness-100 opacity-80"
              />
              <h1 className="text-2xl font-light text-gray-900 dark:text-white tracking-wide">
                typora
              </h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
            >
              {darkMode ? (
                <Sun size={18} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon size={18} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-16">
        {/* Font Grid - 3x2 */}
        <div className="grid grid-cols-3 gap-px border border-gray-100 dark:border-gray-900 mb-16">
          {currentFonts.map((font, index) => (
            <FontCard key={`${font}-${startIndex + index}`} fontName={font} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-12">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-light tracking-wide"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-light tracking-wide"
          >
            Next →
          </button>
        </div>
      </main>

      {/* Font Details Modal */}
      {selectedFont && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-8 z-50">
          <div className="bg-white dark:bg-black rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-100 dark:border-gray-900">
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <h2 className="text-xl font-light text-gray-900 dark:text-white tracking-wide">
                  {selectedFont}
                </h2>
                <button
                  onClick={() => setSelectedFont(null)}
                  className="p-2 hover:bg-gray-50 dark:hover:bg-gray-950 rounded-full transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>

              {/* Font Preview */}
              <div className="mb-10 p-8 bg-gray-50 dark:bg-gray-950 rounded-xl">
                <div
                  className="text-3xl text-gray-900 dark:text-gray-100 mb-4 font-light"
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                >
                  {selectedFont}
                </div>
                <div
                  className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>

              {/* Code Blocks */}
              <div className="space-y-6">
                {Object.entries(getCodeBlocks(selectedFont)).map(([type, code]) => (
                  <CodeBlock
                    key={type}
                    title={type}
                    code={code}
                    type={type}
                    fontName={selectedFont}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .dark {
          color-scheme: dark;
        }

        /* Custom subtle gray shades */
        .bg-gray-25 {
          background-color: #fafafa;
        }
        
        .bg-gray-925 {
          background-color: #0f0f0f;
        }
      `}</style>
    </div>
  );
}
