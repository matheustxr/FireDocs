import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PublicPage from '../pages/PublicPage';
import AdminPage from '../pages/AdminPage';
import MenuNavigation from '../components/menuNavigation';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <MenuNavigation />
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
