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
    const data = await res.json()
    console.log(data)
    return data
  }

  public async createRow(
    table: string,
    { formData, database }: { formData: { [key: string]: string }; database: string }
  ) {
    const res = await fetch(`http://localhost:3000/api/table/${database}/${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const data = await res.json()
    console.log(data)
    return data
  }
}

export default new TableHelper()
