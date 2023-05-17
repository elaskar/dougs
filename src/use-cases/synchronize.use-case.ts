import { format } from 'date-fns';
import { Checkpoint } from 'src/domain/Checkpoint';
import { Movement } from 'src/domain/Movement';

export type SynchronizationResult = {
  success: boolean;
  reasons: string[];
};

export class SynchronizeUseCase {
  public handle(
    movements: Movement[],
    checkpoints: Checkpoint[],
  ): SynchronizationResult {
    let success = true;
    const reasons: string[] = [];
    const orderedCheckpoints = orderByDate([...checkpoints]);
    const uniqueMovements = pushDuplicateMovementIdInReasonsAndGetUniqueOnes(
      movements,
      reasons,
    );
    let balance = orderedCheckpoints[0].amount;
    let lastDate = orderedCheckpoints[0].date;
    for (let index = 1; index < orderedCheckpoints.length; index++) {
      const checkpoint = orderedCheckpoints[index];
      const movementsBeforeCurrentCheckpoint =
        getMovementsBetweenPreviousCheckpointDateAndActualCheckpointDate(
          uniqueMovements,
          checkpoint,
          lastDate,
        );

      balance += sumAllMovementsAmount(movementsBeforeCurrentCheckpoint);
      const movementWithoutAmount = movementsBeforeCurrentCheckpoint.find(
        (movement) => movement.amount === 0 || !movement.amount,
      );
      const diffBetweenBalanceAndCheckpoint = checkpoint.amount - balance;
      if (movementWithoutAmount && diffBetweenBalanceAndCheckpoint !== 0) {
        success = false;
        reasons.push(
          getFormattedReasonOnMissingMovementAmount(
            diffBetweenBalanceAndCheckpoint,
            movementWithoutAmount,
          ),
        );
      }
      if (!movementWithoutAmount && diffBetweenBalanceAndCheckpoint !== 0) {
        success = false;
        reasons.push(
          getFormattedReasonOnMissingAmountBetweenTwoCheckpoints(
            checkpoint.date,
            diffBetweenBalanceAndCheckpoint,
          ),
        );
      }
      balance = checkpoint.amount;
      lastDate = checkpoint.date;
    }
    const movementsAfterLastCheckpoint = getMovementsAfterLastCheckpoint(
      uniqueMovements,
      lastDate,
    );
    if (movementsAfterLastCheckpoint.length > 0) {
      const maxDate = getLastDateFromMovements(movementsAfterLastCheckpoint);
      const amountWithoutCheckpoint = sumAllMovementsAmount(
        movementsAfterLastCheckpoint,
      );
      success = false;
      reasons.push(
        `missing checkpoint at ${
          balance + amountWithoutCheckpoint
        } after ${format(maxDate, 'dd/MM/yyyy')}`,
      );
    }
    return {
      success: success,
      reasons,
    };
  }
}

function getLastDateFromMovements(movementsAfterLastCheckpoint: Movement[]) {
  return movementsAfterLastCheckpoint.reduce(
    (max, movement) => (movement.date > max ? movement.date : max),
    movementsAfterLastCheckpoint[0].date,
  );
}

function getMovementsAfterLastCheckpoint(
  uniqueMovements: Movement[],
  lastDate: Date,
) {
  return uniqueMovements.filter(
    (movement) => movement.date.getTime() > lastDate.getTime(),
  );
}

function getFormattedReasonOnMissingMovementAmount(
  missingAmount: number,
  movementWithoutAmount: Movement,
): string {
  return `missing amount ${missingAmount} on movement with id ${movementWithoutAmount.id}`;
}

function orderByDate(arrayToOrder: Checkpoint[]): Checkpoint[] {
  arrayToOrder.sort((a, b) => {
    const dateA = a.date;
    const dateB = b.date;
    return dateA.getTime() - dateB.getTime();
  });

  return arrayToOrder;
}

function pushDuplicateMovementIdInReasonsAndGetUniqueOnes(
  movements: Movement[],
  reasons: string[],
): Movement[] {
  const { duplicates, uniques } = findDuplicateItems(movements);
  if (duplicates.length) {
    duplicates.forEach((duplicateMovement) => {
      reasons.push(`duplicate id ${duplicateMovement.id}`);
    });
  }
  return uniques;
}

function getMovementsBetweenPreviousCheckpointDateAndActualCheckpointDate(
  uniqueMovements: Movement[],
  checkpoint: Checkpoint,
  lastDate: Date,
) {
  return uniqueMovements.filter(
    (movement) =>
      movement.date.getTime() < checkpoint.date.getTime() &&
      movement.date.getTime() > lastDate.getTime(),
  );
}

function sumAllMovementsAmount(movementsBeforeCurrentCheckpoint: Movement[]) {
  return movementsBeforeCurrentCheckpoint.reduce((acc, movement) => {
    return (acc += movement.amount);
  }, 0);
}

function findDuplicateItems(items: Movement[]): {
  duplicates: Movement[];
  uniques: Movement[];
} {
  const duplicates: Movement[] = [];
  const uniques: Movement[] = [];
  const ids: Set<string> = new Set();

  for (const item of items) {
    if (ids.has(item.id)) {
      duplicates.push(item);
    } else {
      ids.add(item.id);
      uniques.push(item);
    }
  }

  return { duplicates, uniques };
}

function getFormattedReasonOnMissingAmountBetweenTwoCheckpoints(
  checkpointDate: Date,
  amountMissing: number,
): string {
  return `missing ${amountMissing} on ${format(checkpointDate, 'dd/MM/yyyy')}`;
}
