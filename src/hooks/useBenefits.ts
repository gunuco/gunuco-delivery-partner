import {
  useGetBenefitsQuery,
  useGetInsuranceQuery,
} from '@/src/api/endpoints/benefitsApi';
import { useAppSelector } from '@/src/store/hooks';

/**
 * Partner benefits and insurance info.
 */
export function useBenefits() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const benefitsQuery = useGetBenefitsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const insuranceQuery = useGetInsuranceQuery(undefined, {
    skip: !isAuthenticated,
  });

  return {
    benefits: benefitsQuery.data ?? [],
    insurance: insuranceQuery.data ?? null,
    isLoading: benefitsQuery.isLoading || insuranceQuery.isLoading,
    isFetching: benefitsQuery.isFetching || insuranceQuery.isFetching,
    error: benefitsQuery.error ?? insuranceQuery.error,
    refetch: async () => {
      await Promise.all([benefitsQuery.refetch(), insuranceQuery.refetch()]);
    },
  };
}
