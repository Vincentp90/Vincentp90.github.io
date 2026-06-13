import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './translator.css'

const LANGUAGES = [
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'de', name: 'German' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fa', name: 'Persian' },
  { code: 'fr', name: 'French' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ha', name: 'Hausa' },
  { code: 'hi', name: 'Hindi' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ko', name: 'Korean' },
  { code: 'mr', name: 'Marathi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pnb', name: 'Punjabi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'sw', name: 'Swahili' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ur', name: 'Urdu' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Mandarin Chinese' },
  { code: 'jv', name: 'Javanese' },
]

function LanguageSelector({ value, onChange, label }) {
  return (
    <div className="lang-selector">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextInput({ value, onChange, placeholder, readOnly }) {
  return (
    <textarea
      className="text-box"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  )
}

function ApiKeyCard() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '')
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="api-key-card">
      <div className="api-key-header" onClick={() => setShow(!show)}>
        <span>API Key</span>
        <span className="toggle-icon">{show ? '▲' : '▼'}</span>
      </div>
      {show && (
        <div className="api-key-body">
          <div className="api-key-input-row">
            <input
              type="password"
              className="api-key-input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
            />
            <button className="api-key-save" onClick={handleSave}>
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
          <p className="api-key-warning">⚠️ Your API key is stored in your browser's localStorage. It is only send to the Gemini API server. Still, be careful, a website like this could steal your key. You can verify the source code on github, and check your network tab. Also, create a separate API key just for this. Anyone with access to this key can make API calls on your behalf. Never share your key publicly.</p>
        </div>
      )}
    </div>
  )
}

function TranslatorApp() {
  const [sourceLang, setSourceLang] = useState(() => localStorage.getItem('translator_source') || 'en')
  const [targetLang, setTargetLang] = useState(() => localStorage.getItem('translator_target') || 'nl')
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('translator_model') || 'gemini-3.1-flash-lite')

  const handleTranslate = async () => {
    const apiKey = localStorage.getItem('gemini_api_key')
    if (!apiKey) {
      alert('Please enter your Gemini API key in the API Key section.')
      return
    }

    if (!inputText.trim()) return

    setIsTranslating(true)
    const langMap = {
      am: 'Amharic', ar: 'Arabic', bn: 'Bengali', de: 'German', en: 'English',
      es: 'Spanish', fa: 'Persian', fr: 'French', gu: 'Gujarati', ha: 'Hausa',
      hi: 'Hindi', id: 'Indonesian', it: 'Italian', ja: 'Japanese', kn: 'Kannada',
      ko: 'Korean', mr: 'Marathi', nl: 'Dutch', pnb: 'Punjabi', pt: 'Portuguese',
      ru: 'Russian', sw: 'Swahili', ta: 'Tamil', te: 'Telugu', th: 'Thai',
      tl: 'Tagalog', tr: 'Turkish', ur: 'Urdu', vi: 'Vietnamese', zh: 'Mandarin Chinese', jv: 'Javanese',
    }
    const target = langMap[targetLang] || targetLang

    const prompt = `Translate the following text into ${target}. Output ONLY the direct translation. Do not include introductions, explanations, quotes, or conversational fluff.\n\nText to translate:\n${inputText}`

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData?.error?.message || `API error: ${response.status}`)
      }

      const data = await response.json()

      // 1. Check if the response was blocked by safety filters
      const finishReason = data?.candidates?.[0]?.finishReason
      if (finishReason && finishReason !== "STOP") {
        throw new Error(`Translation blocked by API. Reason: ${finishReason}`)
      }

      // 2. Safe, precise extraction of the text field
      const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (translated && translated.trim()) {
        setOutputText(translated.trim())
      } else {
        setOutputText('No translation returned. The model generated an empty response.')
      }
    } catch (error) {
      console.error('Translation failed:', error)
      setOutputText(`Error: ${error.message}`)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSwapLanguages = () => {
    const prevSource = sourceLang
    const prevTarget = targetLang
    setSourceLang(prevTarget)
    setTargetLang(prevSource)
    localStorage.setItem('translator_source', prevTarget)
    localStorage.setItem('translator_target', prevSource)
    setInputText(outputText)
    setOutputText(inputText)
  }

  const handleSourceChange = (lang) => {
    setSourceLang(lang)
    localStorage.setItem('translator_source', lang)
  }

  const handleTargetChange = (lang) => {
    setTargetLang(lang)
    localStorage.setItem('translator_target', lang)
  }

  const handleModelChange = (model) => {
    setSelectedModel(model)
    localStorage.setItem('translator_model', model)
  }

  return (
    <div className="translator-app">
      <div className="api-key-card">
        <div className="api-key-header" onClick={() => setShowAbout(!showAbout)}>
          <span>About this translator</span>
          <span className="toggle-icon">{showAbout ? '▲' : '▼'}</span>
        </div>
        {showAbout && (
          <div className="api-key-body">
            <p className="about-text">
              This translator uses Google's Gemini to translate text between languages.
              You provide your own API key, which is stored locally in your browser and sent directly
              to Google's servers — this website never stores or sees your key.
            </p>
            <p className="about-text">
              <strong>Why I made this</strong> DeepL is pretty good but it doesn't translate as well as modern LLMs which understand tone and context much better than DeepL. However translating with LLMs is cumbersome because you have to chat with them and tell them "Translate this text into this language". So that's why I made this tool, to offer a convenient UI for translating some text by an LLM. I'm not the first to have this idea, <a href="https://github.com/elisemercury/lingo-ai" target="_blank" rel="noopener noreferrer">lingo-ai</a> is pretty much exactly the same idea, however it's no longer up-to-date and doesn't work anymore.
            </p>
          </div>
        )}
      </div>

      <div className="translator-header">
        <LanguageSelector value={sourceLang} onChange={handleSourceChange} label="Translate from" />
        <button className="swap-btn" onClick={handleSwapLanguages} title="Swap languages">⇄</button>
        <LanguageSelector value={targetLang} onChange={handleTargetChange} label="Translate to" />
      </div>

      <div className="translator-body">
        <div className="translator-pane">
          <TextInput
            value={inputText}
            onChange={setInputText}
            placeholder="Enter text to translate..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px', alignItems: 'center' }}>
            <select
              className="model-select"
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={isTranslating}
            >
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
              <option value="gemini-3.5-flash">gemini-3.5-flash</option>
            </select>
            <button
              className="translate-btn"
              onClick={handleTranslate}
              disabled={isTranslating || !inputText.trim()}
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>
        <div className="translator-pane">
          <TextInput
            value={outputText}
            onChange={setOutputText}
            placeholder="Translation will appear here..."
            readOnly
          />
        </div>
      </div>

      <ApiKeyCard />
    </div>
  )
}

function App() {
  return <TranslatorApp />
}

createRoot(document.getElementById('root')).render(<App />)
