import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import './styles/globals.css';

// Create a new query client instance
const queryClient = new QueryClient();

// Create the router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Create a theme instance
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: '#0B6BCB',
          solidHoverBg: '#0A5EB8',
          solidActiveBg: '#0957A8',
        },
      },
    },
  },
  fontFamily: {
    body: 'Inter, sans-serif',
  },
});

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <CssVarsProvider theme={theme} defaultMode="light">
          <CssBaseline />
          <RouterProvider router={router} />
        </CssVarsProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
