import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  useIonViewWillEnter,
  IonFooter,
} from '@ionic/react';
import { useAuth } from '@src/features/auth/AuthProvider';
import { personOutline, exitOutline } from 'ionicons/icons';
import { PropsWithChildren } from 'react';
import HeaderLogo from '../ui/HeaderLogo';

interface BasePageProps extends PropsWithChildren {
  title: string;
  showSignoutButton?: boolean;
  showHeader?: boolean;
  showProfileIcon?: boolean;
  showBackButton?: boolean;
  showLogo?: boolean;
  children: React.ReactNode;
  defaultBackButtonHref?: string;
  footer?: React.ReactNode;
}

const BasePageLayout: React.FC<BasePageProps> = ({
  title,
  children,
  showSignoutButton = false,
  showProfileIcon = true,
  showHeader = true,
  showBackButton = true,
  showLogo = false,
  defaultBackButtonHref,
  footer,
}) => {
  const { signout } = useAuth();
  useIonViewWillEnter(() => {
    if (title) {
      document.title = title + ' - Trove';
    } else {
      document.title = 'Trove - Rewards at Your Fingertips.';
    }
  });
  return (
    <IonPage>
      <IonHeader className='ion-no-border' hidden={!showHeader}>
        <IonToolbar>
          {showBackButton && (
            <IonButtons slot='start'>
              <IonBackButton defaultHref={defaultBackButtonHref} />
            </IonButtons>
          )}
          {showLogo && <HeaderLogo />}
          <IonButtons slot='end'>
            {showProfileIcon && (
              <IonButton routerLink='/profile'>
                <IonIcon slot='icon-only' icon={personOutline} size='default' />
              </IonButton>
            )}
            {showSignoutButton && (
              <IonButton onClick={signout}>
                <IonIcon slot='icon-only' icon={exitOutline}></IonIcon>
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
      {footer && <IonFooter>{footer}</IonFooter>}
    </IonPage>
  );
};

export default BasePageLayout;
