import type { Incentive, Result } from '@/src/types';

export interface IncentiveRepository {
  getActive(): Promise<Result<Incentive[]>>;
  getAll(): Promise<Result<Incentive[]>>;
  getById(id: string): Promise<Result<Incentive>>;
}
