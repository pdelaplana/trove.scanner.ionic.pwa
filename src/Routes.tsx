import {
  IonIcon,
  IonLabel,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router';

import { useAuth, UserRole } from './features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@pages/components/routing/ProtectedRoute';
import SigninPage from './pages/public/signin/SigninPage';
import HomePage from './pages/protected/home/HomePage';
import {
  homeOutline,
  ellipsisHorizontalOutline,
  cashOutline,
} from 'ionicons/icons';
import ScanPage from './pages/protected/scan/ScanCardPage';

export const ROUTES = {
  SIGNIN: '/signin',
  HOME: '/home',
  SCAN: '/scan',
} as const;

interface AuthState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

const TabRoutes = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <ProtectedRoute path={ROUTES.SCAN} exact>
            <ScanPage />
          </ProtectedRoute>
          <ProtectedRoute path='/manage' exact>
            <HomePage />
          </ProtectedRoute>
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot='bottom'>
        <IonTabButton tab='home' href={ROUTES.SCAN}>
          <IonIcon aria-hidden='true' icon={cashOutline} />
          <IonLabel>Scan Card</IonLabel>
        </IonTabButton>

        <IonTabButton tab='manage' href='/manage'>
          <IonIcon aria-hidden='true' icon={ellipsisHorizontalOutline} />
          <IonLabel>Manage</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const Routes: React.FC = () => {
  const { isAuthenticated, authStateLoading, user, signout } = useAuth();
  const [authState, setAuthState] = useState<AuthState>({
    isInitialized: false,
    isLoading: true,
    error: null,
  });

  const isValidBusinessRole = (role?: UserRole): boolean =>
    role === 'businessAdmin' || role === 'businessStaff';

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated) {
          setAuthState({
            isInitialized: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            isInitialized: true,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Failed to get user role:', error);
        setAuthState((prev) => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }));
      }
    };

    if (!authStateLoading) {
      initializeAuth();
    }
  }, [isAuthenticated, authStateLoading, user]);

  if (authStateLoading || (!authState.isInitialized && authState.isLoading)) {
    return <IonLoading isOpen={authState.isLoading} message='Loading...' />;
  }

  if (isAuthenticated && !isValidBusinessRole(user?.role)) {
    console.warn('Not a valid role');
    signout();
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          {/* Public routes */}
          <Route exact path={ROUTES.SIGNIN}>
            <SigninPage />
          </Route>

          {/* Protected routes */}
          <ProtectedRoute path={'/'}>
            <TabRoutes />
          </ProtectedRoute>

          {/* Fallback route - must be last */}
          <Route path='*'>
            <Redirect to={ROUTES.HOME} />
          </Route>
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default Routes;
