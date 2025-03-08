import {
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import CenterContainer from '../layouts/CenterContainer';
import { PropsWithChildren } from 'react';
import HeaderLogo from '../ui/HeaderLogo';
import { ErrorBoundary } from '../ErrorBoundary';

interface PublicPageLayoutProps extends PropsWithChildren {
  title: string;
}

const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({
  title,
  children,
}) => {
  useIonViewWillEnter(() => {
    document.title = 'Trove - Rewards at Your Fingertips.';
  });
  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar className=''>
          <div className='ion-flex ion-justify-content-center'>
            <HeaderLogo />
          </div>
          <IonButtons slot='end'></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ErrorBoundary>
          <CenterContainer>{children}</CenterContainer>
        </ErrorBoundary>
      </IonContent>
    </IonPage>
  );
};
export default PublicPageLayout;
