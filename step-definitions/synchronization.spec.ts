import { defineFeature, loadFeature } from 'jest-cucumber';
import { Movement } from '../src/domain/Movement';
import { Checkpoint } from '../src/domain/Checkpoint';
import {
  SynchronizationResult,
  SynchronizeUseCase,
} from '../src/use-cases/synchronize.use-case';

const feature = loadFeature('./features/synchronization.feature');

defineFeature(feature, (test) => {
  let movements: Movement[] = [];
  let checkpoints: Checkpoint[] = [];
  let synchronizeUseCase: SynchronizeUseCase;
  let result: SynchronizationResult;

  beforeEach(() => {
    movements = [];
    checkpoints = [];
    synchronizeUseCase = new SynchronizeUseCase();
  });

  test('Synchronize correct datas', ({ given, when, then }) => {
    given('following movements :', (table) => {
      table.forEach((row) => {
        movements.push(
          new Movement(
            row.Id,
            new Date(row.Date),
            row.Wording,
            Number.parseFloat(row.Amount),
          ),
        );
      });
    });

    given('following checkpoints :', (table) => {
      table.forEach((row) => {
        checkpoints.push(
          new Checkpoint(new Date(row.Date), Number.parseFloat(row.Balance)),
        );
      });
    });
    when('I synchronize', () => {
      result = synchronizeUseCase.handle(movements, checkpoints);
    });

    then('I should have success', () => {
      expect(result.success).toBe(true);
    });
  });
  test('Synchronize correct datas with duplicate', ({ given, when, then }) => {
    given('following movements :', (table) => {
      table.forEach((row) => {
        movements.push(
          new Movement(
            row.Id,
            new Date(row.Date),
            row.Wording,
            Number.parseFloat(row.Amount),
          ),
        );
      });
    });

    given('following checkpoints :', (table) => {
      table.forEach((row) => {
        checkpoints.push(
          new Checkpoint(new Date(row.Date), Number.parseFloat(row.Balance)),
        );
      });
    });

    when('I synchronize', () => {
      result = synchronizeUseCase.handle(movements, checkpoints);
    });

    then(/^I should have success with reason ((.)*)$/, (reason) => {
      expect(result.success).toBe(true);
      expect(result.reasons.includes(reason)).toBe(true);
    });
  });
});
