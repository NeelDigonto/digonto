import "dotenv/config";
import { Gateway } from './gateway/gateway';

const gateway = new Gateway();
gateway.run();