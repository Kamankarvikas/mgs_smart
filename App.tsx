import React, { useState, createContext, useContext, useMemo, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { LoginPage, OnboardingPage } from './pages/Auth';
import NewLandingPage from './pages/NewLandingPage';
import DashboardLayout from './components/layout';
import DashboardPage from './pages/Dashboard';
import LeadsPage from './pages/Leads';
import ClientsPage from './pages/Clients';
import { LettersPage, InboxPage, TeamPage, SettingsPage } from './pages/More';
import CompanyProfilePage from './pages/Company';

// --- APP SETTINGS MANAGEMENT ---
export interface AppSettings {
  companyName: string;
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | null>(null);

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({
    companyName: 'MGS SmartCredit',
  });

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const value = useMemo(() => ({
    settings,
    updateSettings,
  }), [settings, updateSettings]);

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
};


// --- THEME MANAGEMENT ---

export interface Theme {
  name: string;
  colors: {
    primary: string; // "124 58 237"
    primaryLight: string;
    primaryDark: string;
    primaryForeground: string;
    primaryBgActive: string;
    primaryBgHover: string;
  };
}

const themes: Theme[] = [
  { name: 'Violet', colors: { primary: '124 58 237', primaryLight: '139 92 246', primaryDark: '109 40 217', primaryForeground: '255 255 255', primaryBgActive: '237 233 254', primaryBgHover: '245 243 255' } },
  { name: 'Blue', colors: { primary: '59 130 246', primaryLight: '96 165 250', primaryDark: '37 99 235', primaryForeground: '255 255 255', primaryBgActive: '219 234 254', primaryBgHover: '239 246 255' } },
  { name: 'Green', colors: { primary: '34 197 94', primaryLight: '74 222 128', primaryDark: '22 163 74', primaryForeground: '255 255 255', primaryBgActive: '220 252 231', primaryBgHover: '240 253 244' } },
  { name: 'Red', colors: { primary: '239 68 68', primaryLight: '248 113 113', primaryDark: '220 38 38', primaryForeground: '255 255 255', primaryBgActive: '254 226 226', primaryBgHover: '254 242 242' } },
  { name: 'Indigo', colors: { primary: '99 102 241', primaryLight: '129 140 248', primaryDark: '79 70 229', primaryForeground: '255 255 255', primaryBgActive: '224 231 255', primaryBgHover: '238 242 255' } },
  { name: 'Slate', colors: { primary: '100 116 139', primaryLight: '148 163 184', primaryDark: '71 85 105', primaryForeground: '255 255 255', primaryBgActive: '226 232 240', primaryBgHover: '241 245 249' } },
];

const ThemeContext = createContext<{ theme: Theme; setTheme: (themeName: string) => void; themes: Theme[] } | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedThemeName = window.localStorage.getItem('app-theme');
      const savedTheme = themes.find(t => t.name === savedThemeName);
      const defaultTheme = themes.find(t => t.name === 'Red') || themes[0];
      return savedTheme || defaultTheme;
    } catch (error) {
      console.error('Could not read theme from localStorage', error);
      const defaultTheme = themes.find(t => t.name === 'Red') || themes[0];
      return defaultTheme;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
    root.style.setProperty('--color-primary-foreground', theme.colors.primaryForeground);
    root.style.setProperty('--color-primary-bg-active', theme.colors.primaryBgActive);
    root.style.setProperty('--color-primary-bg-hover', theme.colors.primaryBgHover);
    try {
      window.localStorage.setItem('app-theme', theme.name);
    } catch (error) {
      console.error('Could not save theme to localStorage', error);
    }
  }, [theme]);

  const setTheme = useCallback((themeName: string) => {
    const newTheme = themes.find(t => t.name === themeName);
    if (newTheme) {
      setThemeState(newTheme);
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme, themes }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


// --- AUTH MANAGEMENT ---

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const value = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
  }), [isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppSettingsProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<NewLandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              
              <Route path="/app" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="clients/:clientId" element={<ClientsPage />} />
                <Route path="letters" element={<LettersPage />} />
                <Route path="inbox" element={<InboxPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="company" element={<CompanyProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </HashRouter>
        </AppSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;