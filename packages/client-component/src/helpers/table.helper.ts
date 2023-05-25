class TableHelper {
  public async getRows(
    table: string,
    { fields, database }: { fields: string[]; database: string }
  ) {
    const res = await fetch(
      `http://localhost:3000/api/table/${database}/${table}?${fields
        .map((f) => `field=${f}`)
        .join('&')}`,
      { cache: 'no-store' }
    )
    return res.json()
  }
}

export default new TableHelper()
