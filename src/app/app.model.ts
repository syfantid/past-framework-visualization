
export class PeriodicCell {
  public constructor(
    public slug: string,
    public name: string,
    public rank: number
  ) { }
}

export class PeriodicColumn {
  public entries: PeriodicCell[] = [];

  public constructor(
    public name: string
  ) { }

  public add(slug: string, name: string, rank: number): PeriodicColumn {
    this.entries.push(new PeriodicCell(slug, name, rank));
    return this;
  }
}


export class PeriodicTable {
  public columns: PeriodicColumn[] = [];

  public addColumn(name: string): PeriodicColumn {
    const col = new PeriodicColumn(name);
    this.columns.push(col);
    return col;
  }
}
