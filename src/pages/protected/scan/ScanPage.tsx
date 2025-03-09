import CameraLauncher from '@src/pages/components/cameraLauncher/CameraLauncher';
import BasePageLayout from '@src/pages/components/layouts/BasePageLayout';
import CenterContainer from '@src/pages/components/layouts/CenterContainer';

const ScanPage: React.FC = () => {
  return (
    <BasePageLayout
      title='Code Scanner'
      showLogo={true}
      showBackButton={false}
      showSignoutButton={true}
      showProfileIcon={false}
    >
      <CenterContainer>
        <CameraLauncher />
      </CenterContainer>
    </BasePageLayout>
  );
};
export default ScanPage;
