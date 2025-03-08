import { LoyaltyCardTransaction } from '@src/domain';
import BasePageLayout from '@src/pages/components/layouts/BasePageLayout';
import CenterContainer from '@src/pages/components/layouts/CenterContainer';
import { useEffect, useState } from 'react';
import SearchForm from './components/ScanCardSearchForm';
import ScanCardSearchResults from './components/ScanCardSearchResult';
import ScanCardPurchaseAmountForm from './components/ScanCardPurchaseAmountForm';
import ScanCardResult from './components/ScanCardResult';
import { useHistory, useLocation } from 'react-router-dom';

export enum ScanCardPageState {
  SEARCH = 'SEARCH',
  REVIEW_CUSTOMER = 'REVIEW_CUSTOMER',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  RESULT = 'RESULT',
}

const ScanCardPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const [currentPageState, setPageCurrentState] = useState<ScanCardPageState>(
    ScanCardPageState.SEARCH
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [membershipNumber, setMembershipNumber] = useState<string>('');
  const [loyaltyCardTransaction, setLoyaltyCardTransaction] =
    useState<LoyaltyCardTransaction>();

  const handleSearchStarted = (term: string) => {
    setSearchTerm(term);
    setPageCurrentState(ScanCardPageState.REVIEW_CUSTOMER);
  };

  const handlePageStateChange = (pageState: ScanCardPageState) => {
    setPageCurrentState(pageState);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const memberno = queryParams.get('memberno');
    if (memberno) {
      setSearchTerm(memberno);
      setPageCurrentState(ScanCardPageState.REVIEW_CUSTOMER);
      // Clear by replacing the current URL with one without query params
      history.replace(location.pathname);
    }
  }, [location.search, history, location.pathname]);

  return (
    <BasePageLayout
      title='Scan'
      showLogo={true}
      showBackButton={false}
      showProfileIcon={false}
      showSignoutButton={true}
    >
      <CenterContainer>
        {currentPageState === ScanCardPageState.SEARCH && (
          <SearchForm onSearchStarted={handleSearchStarted} />
        )}
        {currentPageState === ScanCardPageState.REVIEW_CUSTOMER && (
          <ScanCardSearchResults
            membershipId={searchTerm}
            onCustomerLoyaltyCardFound={(membershipNumber) =>
              setMembershipNumber(membershipNumber)
            }
            onPageStateChange={(state) => setPageCurrentState(state)}
          />
        )}
        {currentPageState === ScanCardPageState.ADD_TRANSACTION && (
          <ScanCardPurchaseAmountForm
            membershipNumber={membershipNumber}
            onTransactionCompleted={(transaction) =>
              setLoyaltyCardTransaction(transaction)
            }
            onPageStateChange={(state) => setPageCurrentState(state)}
          />
        )}
        {currentPageState === ScanCardPageState.RESULT && (
          <ScanCardResult
            onPageStateChange={(state) => setPageCurrentState(state)}
            loyaltyCardTransaction={loyaltyCardTransaction ?? null}
          />
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};

export default ScanCardPage;
