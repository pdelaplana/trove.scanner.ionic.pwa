import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { PropsWithChildren } from 'react';

interface CenterContainerProps extends PropsWithChildren {}

const CenterContainer: React.FC<CenterContainerProps> = ({ children }) => {
  return (
    <IonGrid style={{ maxWidth: '1420px' }}>
      <IonRow>
        <IonCol></IonCol>
        <IonCol size='8' sizeSm='12' sizeXs='12' sizeLg='6' sizeXl='6'>
          {children}
        </IonCol>
        <IonCol></IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default CenterContainer;
