import { Route, Routes } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import AuditHistoryPage from '../pages/AuditHistoryPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import DecisionPage from '../pages/DecisionPage.jsx';
import IncidentDetailPage from '../pages/IncidentDetailPage.jsx';
import IncomingReportsPage from '../pages/IncomingReportsPage.jsx';
import IntelligencePage from '../pages/IntelligencePage.jsx';
import MapPage from '../pages/MapPage.jsx';
import ReviewQueuePage from '../pages/ReviewQueuePage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/reports" element={<IncomingReportsPage />} />
        <Route path="/review" element={<ReviewQueuePage />} />
        <Route path="/incidents/:incidentId" element={<IncidentDetailPage />} />
        <Route path="/incidents/:incidentId/intelligence" element={<IntelligencePage />} />
        <Route path="/incidents/:incidentId/decision" element={<DecisionPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/audit" element={<AuditHistoryPage />} />
      </Route>
    </Routes>
  );
}
