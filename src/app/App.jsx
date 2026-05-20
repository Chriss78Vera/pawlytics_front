import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { LandingPage } from '@/app/pages/Landing/LandingPage.jsx';
import { LoginPage } from '@/app/pages/Login/LoginPage.jsx';
import { RegisterPage } from '@/app/pages/Register/RegisterPage.jsx';
import { DashboardPage } from '@/app/pages/Dashboard/DashboardPage.jsx';
import { pawlyticsApi } from '@/app/service/pawlyticsApi.js';
import roleById from '@/app/assets/data/authRoles.json';

const getStoredUser = () => {
  try {
    localStorage.removeItem('pawlytics_user_data');
    const storedLogin = JSON.parse(localStorage.getItem('pawlytics_login'));

    if (!storedLogin) {
      return null;
    }

    return {
      email: storedLogin.email ?? '',
      role: roleById[storedLogin.roleId] ?? 'cliente',
      userId: storedLogin.userId,
      userDataId: storedLogin.userData ?? storedLogin.userDat ?? storedLogin.userDataId,
      userData: null,
      name: storedLogin.name || 'Usuario Pawlytics',
    };
  } catch {
    localStorage.removeItem('pawlytics_login');
    return null;
  }
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(() => getStoredUser());

  const handleLogin = (user) => {
    setAuthUser(user);
    navigate('/dashboard', { replace: true });
  };

  useEffect(() => {
    if (!authUser?.userDataId || authUser.userData) {
      return;
    }

    let isActive = true;

    pawlyticsApi.getUserData(authUser.userDataId)
      .then((userData) => {
        if (!isActive) {
          return;
        }

        setAuthUser((currentUser) => ({
          ...currentUser,
          userData,
          name: `${userData.firstName} ${userData.lastName}`.trim() || currentUser.name,
        }));
      })
      .catch(() => {
        if (isActive) {
          setAuthUser((currentUser) => currentUser);
        }
      });

    return () => {
      isActive = false;
    };
  }, [authUser?.userDataId, authUser?.userData]);

  const handleLogout = () => {
    localStorage.removeItem('pawlytics_login');
    setAuthUser(null);
    navigate('/', { replace: true });
  };

  return (
    <div className="size-full">
      <Routes>
        <Route path="/" element={authUser ? <Navigate to="/dashboard" replace /> : <LandingPage onStart={() => navigate('/login')} />} />
        <Route
          path="/login"
          element={
            authUser
              ? <Navigate to="/dashboard" replace />
              : <LoginPage onBack={() => navigate('/')} onLogin={handleLogin} onRegister={() => navigate('/register')} />
          }
        />
        <Route
          path="/register"
          element={
            authUser
              ? <Navigate to="/dashboard" replace />
              : <RegisterPage onBack={() => navigate('/login')} onRegister={handleLogin} />
          }
        />
        <Route
          path="/dashboard/*"
          element={
            authUser
              ? <DashboardPage user={authUser} onLogout={handleLogout} />
              : <Navigate to="/login" replace state={{ from: location.pathname }} />
          }
        />
        <Route path="*" element={<Navigate to={authUser ? '/dashboard' : '/'} replace />} />
      </Routes>
    </div>
  );
}
