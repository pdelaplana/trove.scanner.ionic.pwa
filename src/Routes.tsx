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

import {
  cashOutline,
  personAddOutline,
  giftOutline,
  scanOutline,
} from 'ionicons/icons';
import { BusinessProvider } from './features/business/BusinessProvider';
import CustomerEnrollmentPage from './pages/protected/enroll/CustomerEnrollmentPage';
import RewardRedemptionPage from './pages/protected/redeem/RewardRedemptionPage';
import LoyaltyCardPage from './pages/protected/reward/LoyaltyCardPage';
import ScanPage from './pages/protected/scan/ScanPage';

export const ROUTES = {
  SIGNIN: '/signin',
  SCAN: '/scan',
  EARN: '/earn',
  REWARD: '/reward',
  ENROLL: '/enroll',
  REDEEM: '/redeem',
  ROOT: '/',
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
          <ProtectedRoute path={ROUTES.REWARD} exact>
            <LoyaltyCardPage />
          </ProtectedRoute>
          <ProtectedRoute path={ROUTES.ENROLL} exact>
            <CustomerEnrollmentPage />
          </ProtectedRoute>
          <ProtectedRoute path={ROUTES.REDEEM} exact>
            <RewardRedemptionPage />
          </ProtectedRoute>

          <Route path='*'>
            <Redirect to={ROUTES.SCAN} />
          </Route>
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot='bottom'>
        <IonTabButton tab='scan' href={ROUTES.SCAN}>
          <IonIcon aria-hidden='true' icon={scanOutline} />
          <IonLabel>Scan</IonLabel>
        </IonTabButton>
        <IonTabButton tab='reward' href={ROUTES.REWARD}>
          <IonIcon aria-hidden='true' icon={cashOutline} />
          <IonLabel>Reward</IonLabel>
        </IonTabButton>
        <IonTabButton tab='redeem' href={ROUTES.REDEEM}>
          <IonIcon aria-hidden='true' icon={giftOutline} />
          <IonLabel>Redeem</IonLabel>
        </IonTabButton>
        <IonTabButton tab='enroll' href={ROUTES.ENROLL}>
          <IonIcon aria-hidden='true' icon={personAddOutline} />
          <IonLabel>Enroll</IonLabel>
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
          <ProtectedRoute path={ROUTES.ROOT}>
            {user?.businessId && (
              <BusinessProvider businessId={user.businessId}>
                <TabRoutes />
              </BusinessProvider>
            )}
          </ProtectedRoute>

          {/* Fallback route - must be last */}
          <Route path='*'>
            <Redirect to={ROUTES.SCAN} />
          </Route>
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default Routes;
