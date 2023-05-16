export class Movement {
  public constructor(
    public readonly id: string,
    public readonly date: Date,
    public readonly wording: string,
    public readonly amount: number,
  ) {}
}
