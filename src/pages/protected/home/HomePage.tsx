import BasePageLayout from '@src/pages/components/layouts/BasePageLayout';
import CenterContainer from '@src/pages/components/layouts/CenterContainer';

const HomePage = () => {
  return (
    <BasePageLayout
      title='Home'
      showLogo={true}
      showBackButton={false}
      showProfileIcon={false}
      showSignoutButton={true}
    >
      <CenterContainer>
        <h1>Home</h1>
      </CenterContainer>
    </BasePageLayout>
  );
};
export default HomePage;
