import { Header } from "~/components/header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col">
      <Header />
      {children}
    </div>
  );
}
