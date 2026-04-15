export const metadata = {
  title: 'Chatbot SaaS',
  description: 'Chatbot con IA para negocios',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}