import { AuthContextProvider } from '@/context/AuthContext';
import { Inter } from 'next/font/google';
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from '@/components/common/footer';

// Load the Inter font with 'latin' subset
const inter = Inter( { subsets: [ 'latin' ] } );

// Metadata for the application
export const metadata = {
  title: 'Permeso',
  description: 'A website where you can find new clients!',
};

// Root layout component for the application
export default function RootLayout( { children }: { children: React.ReactNode } ): JSX.Element {
  return (
      <html lang="en">
      {/*
        The <head /> component will contain the components returned by the nearest parent
        head.js. It can be used to define the document head for SEO, metadata, and other purposes.
        Learn more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <script async src="https://umami-azure-one.vercel.app/script.js"
              data-website-id="b26f43ac-2e62-4378-b63b-767ef44d6db6"></script>
      <head/>
      <body 
         className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
      )}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main>
              <AuthContextProvider>
                  {children}
              </AuthContextProvider>
              <Footer/>
            </main>
          </ThemeProvider>
      {/* Wrap the children with the AuthContextProvider to provide authentication context */}
    
      </body>
      </html>
  );
}
