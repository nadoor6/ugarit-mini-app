import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ListingsPage } from './ListingsPage';
import { ListingDetail } from './ListingDetail';
import { CreateListingForm } from './CreateListingForm'; // Add this import


export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listing/:listingId" element={<ListingDetail />} />
        <Route path="/create" element={<CreateListingForm />} /> {/* Add this route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}