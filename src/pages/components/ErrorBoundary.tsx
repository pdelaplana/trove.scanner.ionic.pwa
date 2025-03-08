import React, { Component, ErrorInfo, ReactNode } from 'react';
import { IonText, IonContent, IonButton } from '@ionic/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <IonContent className='ion-padding'>
            <IonText color='danger'>
              <h2>Something went wrong</h2>
              <p>{this.state.error?.message}</p>
            </IonText>
            <IonButton onClick={() => this.setState({ hasError: false })}>
              Try again
            </IonButton>
          </IonContent>
        )
      );
    }

    return this.props.children;
  }
}
