
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import ToolPage from './pages/ToolPage.tsx';
import Admin from './pages/Admin.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Dashboard from './pages/Dashboard.tsx';
import { AuthProvider } from './components/AuthContext.tsx';
import { I18nProvider } from './components/I18nContext.tsx';

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/:toolId" element={<ToolPage />} />
            
            {/* Legacy or mistyped paths redirected to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
      </AuthProvider>
    </I18nProvider>
  );
};

export default App;
