import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <DashboardContent />
    </div>
  );
}

export default Dashboard;