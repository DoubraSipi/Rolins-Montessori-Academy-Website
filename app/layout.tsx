export const metadata = { title: "Rolins Montessori Academy", description: "Nursery, Primary and Secondary in Alakahia, Port Harcourt." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <header style={{ padding: "12px 20px", borderBottom: "1px solid #eee" }}>
          <strong>Rolins Montessori Academy</strong>
        </header>
        <main style={{ padding: 20 }}>{children}</main>
      </body>
    </html>
  );
}
