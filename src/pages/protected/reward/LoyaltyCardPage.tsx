import { LoyaltyCardTransaction } from '@src/domain';
import BasePageLayout from '@src/pages/components/layouts/BasePageLayout';
import CenterContainer from '@src/pages/components/layouts/CenterContainer';
import { useEffect, useState } from 'react';
import SearchForm from './components/LoyaltyCardSearchForm';
import ScanCardSearchResults from './components/LoyaltyCardSearchResult';
import ScanCardPurchaseAmountForm from './components/LoyaltyCardPurchaseForm';
import ScanCardResult from './components/LoyaltyCardTransactionResult';
import { useHistory, useLocation } from 'react-router-dom';

export enum LoyaltyCardPageState {
  SEARCH = 'SEARCH',
  REVIEW_CUSTOMER = 'REVIEW_CUSTOMER',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  RESULT = 'RESULT',
}

const LoyaltyCardPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const [currentPageState, setPageCurrentState] =
    useState<LoyaltyCardPageState>(LoyaltyCardPageState.SEARCH);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [membershipNumber, setMembershipNumber] = useState<string>('');
  const [loyaltyCardTransaction, setLoyaltyCardTransaction] =
    useState<LoyaltyCardTransaction>();

  const handleSearchStarted = (term: string) => {
    setSearchTerm(term);
    setPageCurrentState(LoyaltyCardPageState.REVIEW_CUSTOMER);
  };

  const handlePageStateChange = (pageState: LoyaltyCardPageState) => {
    setPageCurrentState(pageState);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const memberno = queryParams.get('memberno');
    if (memberno) {
      setSearchTerm(memberno);
      setPageCurrentState(LoyaltyCardPageState.REVIEW_CUSTOMER);
      // Clear by replacing the current URL with one without query params
      history.replace(location.pathname);
    }
  }, [location.search, history, location.pathname]);

  return (
    <BasePageLayout
      title='Reward Points'
      showLogo={true}
      showBackButton={false}
      showProfileIcon={false}
      showSignoutButton={true}
    >
      <CenterContainer>
        {currentPageState === LoyaltyCardPageState.SEARCH && (
          <SearchForm onSearchStarted={handleSearchStarted} />
        )}
        {currentPageState === LoyaltyCardPageState.REVIEW_CUSTOMER && (
          <ScanCardSearchResults
            membershipId={searchTerm}
            onCustomerLoyaltyCardFound={(membershipNumber) =>
              setMembershipNumber(membershipNumber)
            }
            onPageStateChange={(state) => setPageCurrentState(state)}
          />
        )}
        {currentPageState === LoyaltyCardPageState.ADD_TRANSACTION && (
          <ScanCardPurchaseAmountForm
            membershipNumber={membershipNumber}
            onTransactionCompleted={(transaction) =>
              setLoyaltyCardTransaction(transaction)
            }
            onPageStateChange={(state) => setPageCurrentState(state)}
          />
        )}
        {currentPageState === LoyaltyCardPageState.RESULT && (
          <ScanCardResult
            onPageStateChange={(state) => setPageCurrentState(state)}
            loyaltyCardTransaction={loyaltyCardTransaction ?? null}
          />
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};

export default LoyaltyCardPage;
