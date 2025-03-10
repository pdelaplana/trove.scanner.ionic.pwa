import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth, UserRole } from '@features/auth/AuthProvider';
import { IonLoading } from '@ionic/react';

interface IProtectedRouteProps extends RouteProps {
  requiredRoles?: UserRole[];
  fallbackPath?: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  children,
  requiredRoles = [undefined],
  fallbackPath = '/signin',
  ...rest
}) => {
  const { isAuthenticated, authStateLoading } = useAuth();

  if (authStateLoading) {
    return <IonLoading isOpen={authStateLoading}></IonLoading>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{ pathname: fallbackPath, state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
