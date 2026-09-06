/** Side-effect imports so injectEndpoints register on `baseApi`. */
import './endpoints/authApi';
import './endpoints/partnerApi';
import './endpoints/ordersApi';
import './endpoints/earningsApi';
import './endpoints/incentivesApi';
import './endpoints/performanceApi';
import './endpoints/shiftsApi';
import './endpoints/demandApi';
import './endpoints/notificationsApi';
import './endpoints/supportApi';
import './endpoints/documentsApi';
import './endpoints/vehicleApi';
import './endpoints/benefitsApi';
import './endpoints/referralApi';

export { baseApi, resetApiState } from './baseApi';
export type { ApiCustomError, ApiTagType } from './baseApi';
export { mapResult } from './mapResult';
