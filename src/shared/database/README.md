# DB Migration

## 순서

### 1. 데이터베이스

### 1-1. 엔티티 생성

### 1.2. npm run migration:generate 실행
- 엔티티(코드)와 실제 데이터베이스 스키마를 비교해서, 차이점(변경점)을 자동으로 감지하여 새로운 마이그레이션 파일을 생성

### 1.3 npm run migration:run 으로 적용
- 이미 만들어진 마이그레이션 파일을 DB에 반영

----------------

### 2. 시드

### 2.1.시드 데이터가 필요하다면 seeds 파일 생성 (builtInBoard 모듈 seeds 폴더 참조)

### 2.2 npm run seeds 시드 내용 적용 (적용이 제대로 되었다면 커맨드 실행 후, 스크립트 확인 가능)

### 2.3. 한번에 적용하고 싶다면, npm run setup-db

### 3-1. npm run start:${env}
