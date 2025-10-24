import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">{title}</h1>
          <div className="h-1 w-20 bg-accent rounded-full"></div>
        </header>

        <main>{children}</main>

        <Footer />
      </div>
    </div>
  );
}
