import * as dotenv from 'dotenv';
import * as path from 'path';

// .env.test 파일 로드
dotenv.config({
  path: path.resolve(__dirname, '../envs/.env.test'),
});

// 환경변수 확인 (선택사항 - 디버깅용)
console.log('Test environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
});
