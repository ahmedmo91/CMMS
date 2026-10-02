// Modular server-side database helper
import * as schema from '../../src/core/db/schema.ts';

export { schema };

export interface ServerDatabaseState {
  isReady: boolean;
}

export const serverDbState: ServerDatabaseState = {
  isReady: true,
};
