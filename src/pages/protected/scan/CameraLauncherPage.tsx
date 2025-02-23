import CameraLauncher from '@src/pages/components/cameraLauncher/CameraLauncher';
import BasePageLayout from '@src/pages/components/layouts/BasePageLayout';
import CenterContainer from '@src/pages/components/layouts/CenterContainer';

const CameraLauncherPage: React.FC = () => {
  return (
    <BasePageLayout title='QR Code Scanner' defaultBackButtonHref='/scan'>
      <CenterContainer>
        <CameraLauncher />
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CameraLauncherPage;
