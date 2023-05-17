import { Body, Controller, Post } from '@nestjs/common';
import { SynchronizeUseCase } from '../use-cases/synchronize.use-case';

export type SynchronizationDTO = {
  movements: any[];
  balances: any[];
};

@Controller('movements')
export class AppController {
  @Post('validation')
  public synchronizeMovements(@Body() synchronization: SynchronizationDTO) {
    return new SynchronizeUseCase().handle(
      synchronization.movements,
      synchronization.balances,
    );
  }
}
