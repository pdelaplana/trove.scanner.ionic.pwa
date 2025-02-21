import React from 'react';

import { IonImg } from '@ionic/react';
import styled from 'styled-components';

const StyledIonImg = styled(IonImg)`
  width: 120px;
  height: 55px;
  margin-left: 15px;
  margin-top: 2px;
  margin-bottom: -2px;
`;

const HeaderLogo: React.FC = () => {
  return (
    <StyledIonImg
      src='/images/trove.logo.header.png'
      alt='Trove'
      data-testid='the-logo'
    ></StyledIonImg>
  );
};

export default HeaderLogo;
