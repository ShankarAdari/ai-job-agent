import './globals.css';

export const metadata = {
  title: 'AI Job Agent — Real-Time Job Discovery & Auto-Apply',
  description: 'AI-powered job discovery and automated application system. Upload your resume, set preferences, and let the AI agent apply to jobs for you in real-time.',
  keywords: 'AI job search, auto apply jobs, job automation, resume parser, job agent',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#07080f" />
      </head>
      <body>{children}</body>
    </html>
  );
}
