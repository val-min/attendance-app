import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import EmployeeDashboard from './pages/Employee';
import AdminDashboard from './pages/Admin';

const PrivateRoute = ({
  children,
  role,
}: {
  children: React.ReactElement;
  role?: string;
}) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Tambahkan rute untuk Employee Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute role="employee">
              <EmployeeDashboard /> 
            </PrivateRoute>
          } 
        />

         <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Pastikan default redirect diarahkan ke halaman yang benar */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;