import React from 'react';

import { IonImg } from '@ionic/react';
import styled from 'styled-components';

const StyledIonImgContainer = styled.div`
  justify-content: center; // Centers horizontally

  IonImg {
    width: 100%;
    max-width: 300px;
  }
`;

const MainLogo: React.FC = () => {
  return (
    <StyledIonImgContainer>
      <IonImg
        src='/public/images/trove.logo.png'
        alt='Trove'
        data-testid='the-logo'
      ></IonImg>
    </StyledIonImgContainer>
  );
};

export default MainLogo;
