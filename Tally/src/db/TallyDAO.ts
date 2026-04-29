import { JSONFilePreset } from 'lowdb/node'

export class TallyDAO {
  db: any

  constructor() {
    this.db = null
  }

  // Initialize the connection
  async init() {
    const defaultData = { tallies: [] }
    this.db = await JSONFilePreset('./db.json', defaultData)
  }

  // Get all items
  async getAll() {
    await this.db.read() // Optional: Refresh if external edits occur
    return this.db.data.tallies
  }

  // Add a new tally
  async add(tally) {
    this.db.data.tallies.push(tally)
    await this.db.write()
    return tally
  }

  // Find by ID
  async findById(id) {
    return this.db.data.tallies.find(t => t.id === id)
  }
}