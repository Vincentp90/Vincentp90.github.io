import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './translator.css'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'nl', name: 'Dutch' },
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
      )}
    </div>
  )
}

function TranslatorApp() {
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('nl')
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    const apiKey = localStorage.getItem('gemini_api_key')
    if (!apiKey) {
      alert('Please enter your Gemini API key in the API Key section.')
      return
    }

    if (!inputText.trim()) return

    setIsTranslating(true)
    const langMap = { en: 'English', nl: 'Dutch' }
    const target = langMap[targetLang] || targetLang

    const prompt = `Translate the following text into ${target}. Output ONLY the direct translation. Do not include introductions, explanations, quotes, or conversational fluff.\n\nText to translate:\n${inputText}`

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
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

  const handleSourceChange = (lang) => {
    setSourceLang(lang)
    setTargetLang(lang === 'en' ? 'nl' : 'en')
  }

  return (
    <div className="translator-app">
      <div className="translator-header">
        <LanguageSelector value={sourceLang} onChange={handleSourceChange} label="Translate from" />
        <LanguageSelector value={targetLang} onChange={setTargetLang} label="Translate to" />
      </div>

      <div className="translator-body">
        <div className="translator-pane">
          <TextInput
            value={inputText}
            onChange={setInputText}
            placeholder="Enter text to translate..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
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
