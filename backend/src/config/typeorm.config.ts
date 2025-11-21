import { config } from 'dotenv';
config();

/**
 * Replaced TypeORM config with a small MongoDB / Mongoose config helper.
 * Export a URI and common connection options so other code can import it if needed.
 */

export const MongoConfig = {
  uri:
    process.env.MONGODB_URI ||
    `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '27017'}/${process.env.DB_DATABASE || 'bidathlete'}`,
  options: {
    // Modern mongoose ignores some of these but keeping safe defaults for clarity
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  } as any,
};

export function getMongoConfig() {
  return MongoConfig;
}

export default MongoConfig;