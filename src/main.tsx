import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { StoryApp } from './stories/StoryHome.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoryApp />
  </React.StrictMode>,
)
