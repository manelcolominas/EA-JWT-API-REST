import { logger } from './config';
import app from './app'

async function main() {
  await app.listen(app.get('port'));
  logger.info('Server on port', app.get('port'));
}

main();
