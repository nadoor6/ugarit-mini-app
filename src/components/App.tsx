import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ListingsPage } from './ListingsPage';
import { ListingDetail } from './ListingDetail';
import { CreateListingForm } from './CreateListingForm';
import LoginAnimation from './login/LoginAnimation';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAnimation />} />
        <Route path="/marketplace" element={<ListingsPage />} />
        <Route path="/listing/:listingId" element={<ListingDetail />} />
        <Route path="/create" element={<CreateListingForm />} />
      </Routes>
    </BrowserRouter>
  );
}