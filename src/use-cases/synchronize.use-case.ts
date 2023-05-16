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
    const reasons: string[] = [];
    const orderedCheckpoints = orderByDate([...checkpoints]);
    const uniqueMovements = pushDuplicateMovementIdInReasonsAndGetUniqueOnes(
      movements,
      reasons,
    );
    let balance = orderedCheckpoints[0].amount;
    for (let index = 1; index < orderedCheckpoints.length; index++) {
      const element = orderedCheckpoints[index];
      uniqueMovements
        .filter((movement) => movement.date <= element.date)
        .forEach((movement) => (balance += movement.amount));
    }
    return {
      success:
        balance === orderedCheckpoints[orderedCheckpoints.length - 1].amount,
      reasons,
    };
  }
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

function orderByDate(arrayToOrder: Checkpoint[]): Checkpoint[] {
  arrayToOrder.sort((a, b) => {
    const dateA = a.date;
    const dateB = b.date;
    return dateA.getTime() - dateB.getTime();
  });

  return arrayToOrder;
}
