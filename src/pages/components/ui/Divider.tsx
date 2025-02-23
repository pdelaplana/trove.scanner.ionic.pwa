import styled from 'styled-components';

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--ion-color-medium);
  margin: var(--ion-margin);
  justify-content: center;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--ion-color-light-shade);
  }
`;
