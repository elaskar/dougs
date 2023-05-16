import { Movement } from './Movement';

describe('Movement', () => {
  it('should have a date', () => {
    const movement = new Movement(
      '1',
      new Date('01-22-2023'),
      'my movement',
      0,
    );
    expect(movement.date).toEqual(new Date('01-22-2023'));
  });

  it('should have an amount', () => {
    const movement = new Movement(
      '1',
      new Date('01-22-2023'),
      'my movement',
      100,
    );
    expect(movement.amount).toEqual(100);
  });
});
