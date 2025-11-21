// No-op migration to avoid TypeORM dependency during compilation
export default class InitialSchema {
  public async up(): Promise<void> {
    // migration intentionally left blank because project uses Mongoose now
  }

  public async down(): Promise<void> {
    // no-op
  }
}
