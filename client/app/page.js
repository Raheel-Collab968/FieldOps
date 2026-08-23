import MainShell from "./layout/main-shell";
import AdminDashboard from './admin/AdminDashboard/page';

export default function Home() {
  return (
    <MainShell>
      
      <AdminDashboard />
    </MainShell>
  );
}
