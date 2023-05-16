import { Checkpoint } from './Checkpoint';

describe('Checkpoint', () => {
  it('should have a date', () => {
    const checkpoint = new Checkpoint(new Date('01-22-2023'), 0);
    expect(checkpoint.date).toEqual(new Date('01-22-2023'));
  });

  it('should have an amount', () => {
    const checkpoint = new Checkpoint(new Date(), 100);
    expect(checkpoint.amount).toEqual(100);
  });
});
