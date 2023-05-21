import {BadRequestException, Body, Controller, HttpException, HttpStatus, Post, Res} from '@nestjs/common';
import { SynchronizeUseCase } from '../use-cases/synchronize.use-case';
import { Movement } from '../domain/Movement';
import { Checkpoint } from '../domain/Checkpoint';
import { parse } from 'date-fns';
import { Response } from 'express';
import { SynchronizationDTO } from './SynchronizationDTO';

function parseDTO(synchronization: SynchronizationDTO) {
  if(!synchronization.balances || !synchronization.balances.length ){
    throw new BadRequestException('Missing or empty balances')
  }
  if(!synchronization.movements || !synchronization.movements.length ){
    throw new BadRequestException('Missing or empty movements')
  }
  const movements = synchronization.movements.map(
      (dto) =>
          new Movement(
              dto.id,
              parse(dto.date, 'dd/MM/yyyy', new Date()),
              dto.label,
              dto.amount,
          ),
  );
  const checkpoints = synchronization.balances.map(
      (dto) =>
          new Checkpoint(parse(dto.date, 'dd/MM/yyyy', new Date()), dto.balance),
  );
  return {movements, checkpoints};
}

@Controller('movements')
export class AppController {
  @Post('validation')
  public synchronizeMovements(
    @Body() synchronization: SynchronizationDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const {movements, checkpoints} = parseDTO(synchronization);
    const result = new SynchronizeUseCase().handle(movements, checkpoints);
    if (result.success) {
      response.status(HttpStatus.OK).json('Accepted');
    } else {
      response.status(HttpStatus.BAD_REQUEST).json({ reasons: result.reasons });
    }
  }
}
