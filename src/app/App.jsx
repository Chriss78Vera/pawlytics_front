import { useEffect, useState } from 'react';
import { LandingPage } from './pages/Landing/LandingPage.jsx';
import { LoginPage } from './pages/Login/LoginPage.jsx';
import { RegisterPage } from './pages/Register/RegisterPage.jsx';
import { DashboardPage } from './pages/Dashboard/DashboardPage.jsx';
import { pawlyticsApi } from './service/pawlyticsApi.js';

const roleById = {
  1: 'admin',
  2: 'cliente',
  3: 'veterinario',
};

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
  const [authUser, setAuthUser] = useState(() => getStoredUser());
  const [currentView, setCurrentView] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pawlytics_login')) ? 'dashboard' : 'landing';
    } catch {
      localStorage.removeItem('pawlytics_login');
      return 'landing';
    }
  });

  const handleLogin = (user) => {
    setAuthUser(user);
    setCurrentView('dashboard');
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
    setCurrentView('landing');
  };

  return (
    <div className="size-full">
      {currentView === 'landing' && <LandingPage onStart={() => setCurrentView('login')} />}
      {currentView === 'login' && (
        <LoginPage
          onBack={() => setCurrentView('landing')}
          onLogin={handleLogin}
          onRegister={() => setCurrentView('register')}
        />
      )}
      {currentView === 'register' && (
        <RegisterPage
          onBack={() => setCurrentView('login')}
          onRegister={handleLogin}
        />
      )}
      {currentView === 'dashboard' && authUser && (
        <DashboardPage user={authUser} onLogout={handleLogout} />
      )}
    </div>
  );
}
