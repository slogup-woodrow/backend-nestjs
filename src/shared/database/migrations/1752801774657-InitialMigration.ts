import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1752801774657 implements MigrationInterface {
  name = 'InitialMigration1752801774657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "StaticBoard" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "category" character varying(50) NOT NULL, "writer" character varying(50) NOT NULL, "birth" TIMESTAMP WITH TIME ZONE NOT NULL, "phone" character varying(15) NOT NULL, "body" character varying(2000) NOT NULL, "isActivated" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_d4b990368c57eba037ba62542df" PRIMARY KEY ("id")); COMMENT ON COLUMN "StaticBoard"."id" IS '데이터 ID(PK)'; COMMENT ON COLUMN "StaticBoard"."createdAt" IS '생성 일시'; COMMENT ON COLUMN "StaticBoard"."updatedAt" IS '수정 일시'; COMMENT ON COLUMN "StaticBoard"."deletedAt" IS '삭제 일시'; COMMENT ON COLUMN "StaticBoard"."category" IS '게시글 유형'; COMMENT ON COLUMN "StaticBoard"."writer" IS '작성자 이름'; COMMENT ON COLUMN "StaticBoard"."birth" IS '작성자 생년월일'; COMMENT ON COLUMN "StaticBoard"."phone" IS '작성자 휴대폰 번호'; COMMENT ON COLUMN "StaticBoard"."body" IS '게시글 내용'; COMMENT ON COLUMN "StaticBoard"."isActivated" IS '게시글 공개 활성화 여부'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7537160b250656b164b06fb65a" ON "StaticBoard" ("category") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7537160b250656b164b06fb65a"`,
    );
    await queryRunner.query(`DROP TABLE "StaticBoard"`);
  }
}
