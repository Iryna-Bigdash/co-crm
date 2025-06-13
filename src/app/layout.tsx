import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import AuthProviders from './components/auth-providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const font = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'CRM 👩🏻‍💻',
  description: 'Developed by Iryna Bigdash',
  keywords: 'Iryna Bigdash, create CRM, build site, write site, developer, tech, full-stack engineer',
  author: 'Iryna Bigdash',
  url: 'https://www.linkedin.com/in/iryna-bigdash',
  image: 'https://media.licdn.com/dms/image/D5603AQHXxydDXqgl7w/profile-displayphoto-shrink_400_400/0/1712138229685?e=1728518400&v=beta&t=wmMAe3gM9AzuI1Gvfg5_I1gIwZV8GPu8gU2jBs_Z9u0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <title>{metadata.title}</title>

        {/* Open Graph для LinkedIn */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content="website" />

        {/* Favicon */}
        <link rel="icon" href="icons/favicon.svg" sizes="any" />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Iryna Bigdash",
              "url": metadata.url,
              "sameAs": [
                "https://www.linkedin.com/in/iryna-bigdash",
                "https://www.facebook.com/ira.bigdash"
              ],
              "jobTitle": "Developer",
              "worksFor": {
                "@type": "FullStack Developer",
                "name": "Web sites, crm systems, data base"
              }
            })
          }}
        />
      </head>
      <body className={font.className}>
        <AuthProviders>
          {children}
        </AuthProviders>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="toast"
        />
      </body>
    </html>
  );
}
