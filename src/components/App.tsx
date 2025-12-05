import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ListingsPage } from './ListingsPage';
import { ListingDetail } from './ListingDetail';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listing/:listingId" element={<ListingDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}