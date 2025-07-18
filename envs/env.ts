import { commonConstants } from 'src/shared/constants/common.constants';
import * as path from 'path';

const { LOCAL, DEV, PROD } = commonConstants.props.nodeEnvs;
let envFilePath = 'envs/.env.local';
if (process.env.NODE_ENV === DEV) envFilePath = 'envs/.env.dev';
else if (process.env.NODE_ENV === PROD) envFilePath = 'envs/.env.prod';

export default envFilePath;
