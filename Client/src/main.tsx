const originalError = console.error;

// Override console.error to suppress specific warnings
console.error = (...args) => {
  // Suppress the ReactDOM.render deprecation warning
  if (/ReactDOM.render is no longer supported in React 18/.test(args[0])) return;

  // Suppress Chakra UI defaultProps warning
  if (/Support for defaultProps will be removed from function components/.test(args[0])) return;

  // Call the original console.error for all other warnings
  originalError.apply(console, args);
};

import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'

import theme from './configs/theme.ts'
import App from './App.tsx'

import './index.css'
import ErrorBoundary from './components/common/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </ChakraProvider>
)
