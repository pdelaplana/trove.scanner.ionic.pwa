import BasePageLayout from '@src/pages/components/layouts/BasePageLayout';
import CenterContainer from '@src/pages/components/layouts/CenterContainer';
import { useEffect, useState } from 'react';
import RewardRedemptionScanForm from './components/RewardRedemptionScanForm';
import RewardRedemptionScanResult from './components/RewardRedemptionScanResult';
import RewardRedemptionFinalizeForm from './components/RewardRedemptionFinalizeForm';
import { LoyaltyCardTransaction } from '@src/domain';
import RewardRedemptionSuccess from './components/RewardRedemptionSuccess';
import RewardRedemptionFail from './components/RewardRedemptionFail';
import { useHistory, useLocation } from 'react-router-dom';

export interface RewardRedemptionPageState {
  viewState: 'scan' | 'review' | 'finalize' | 'success' | 'error';
  rewardCode: string;
  transaction?: LoyaltyCardTransaction;
  error?: string;
}

const RewardRedemptionPage: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const [pageState, setPageState] = useState<RewardRedemptionPageState>({
    viewState: 'scan',
    rewardCode: '',
  });

  useEffect(() => {
    // Read params
    const params = new URLSearchParams(location.search);
    const rewardcode = params.get('rewardcode');

    if (rewardcode) {
      // Process the param
      setPageState({
        viewState: 'review',
        rewardCode: rewardcode,
      });
      // Clear by replacing the current URL with one without query params
      history.replace(location.pathname);
    }
  }, [location.search, history, location.pathname]);

  return (
    <BasePageLayout
      title='Redeem'
      showLogo={true}
      showBackButton={false}
      showProfileIcon={false}
      showSignoutButton={true}
    >
      <CenterContainer>
        {pageState.viewState === 'scan' && (
          <RewardRedemptionScanForm onPageStateChange={setPageState} />
        )}
        {pageState.viewState === 'review' && pageState.rewardCode && (
          <RewardRedemptionScanResult
            rewardCode={pageState.rewardCode}
            onPageStateChange={setPageState}
          />
        )}
        {pageState.viewState === 'finalize' && (
          <RewardRedemptionFinalizeForm
            rewardCode={pageState.rewardCode}
            onPageStateChange={setPageState}
          />
        )}
        {pageState.viewState === 'success' && pageState.transaction && (
          <RewardRedemptionSuccess
            loyaltyCardTransaction={pageState.transaction}
            onPageStateChange={setPageState}
          />
        )}
        {pageState.viewState === 'error' && pageState.error && (
          <RewardRedemptionFail
            error={pageState.error}
            onPageStateChange={setPageState}
          />
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};

export default RewardRedemptionPage;
