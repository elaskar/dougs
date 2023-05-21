import { BalanceDTO } from './BalanceDTO';
import { MovementDTO } from './MovementDTO';

export type SynchronizationDTO = {
  movements: MovementDTO[];
  balances: BalanceDTO[];
};
