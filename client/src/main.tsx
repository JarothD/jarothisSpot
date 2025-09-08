import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Providers } from '@app/providers'
import { router } from '@app/routes'
import '@shared/config/zod'
import '@/index.css'


const rootElement = document.getElementById('root');
if (rootElement) {
  const Root = import.meta.env.MODE === 'development' 
    ? StrictMode 
    : React.Fragment

  createRoot(rootElement).render(
    <Root>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </Root>
  );
}
