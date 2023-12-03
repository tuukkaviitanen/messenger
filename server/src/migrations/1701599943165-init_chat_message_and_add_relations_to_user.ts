import { MigrationInterface, QueryRunner } from "typeorm";

export class InitChatMessageAndAddRelationsToUser1701599943165 implements MigrationInterface {
    name = 'InitChatMessageAndAddRelationsToUser1701599943165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "chat_message" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "content" character varying NOT NULL,
                "timestamp" TIMESTAMP NOT NULL,
                "senderId" uuid,
                CONSTRAINT "PK_3cc0d85193aade457d3077dd06b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "chat_message_recipients_user" (
                "chatMessageId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_77f1a4cbe085321c70b507de509" PRIMARY KEY ("chatMessageId", "userId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e4f2d4c1885d93c03c8e64f7b2" ON "chat_message_recipients_user" ("chatMessageId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8b47990872b34d2a885fae0756" ON "chat_message_recipients_user" ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "chat_message"
            ADD CONSTRAINT "FK_a2be22c99b34156574f4e02d0a0" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "chat_message_recipients_user"
            ADD CONSTRAINT "FK_e4f2d4c1885d93c03c8e64f7b2a" FOREIGN KEY ("chatMessageId") REFERENCES "chat_message"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "chat_message_recipients_user"
            ADD CONSTRAINT "FK_8b47990872b34d2a885fae07560" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "chat_message_recipients_user" DROP CONSTRAINT "FK_8b47990872b34d2a885fae07560"
        `);
        await queryRunner.query(`
            ALTER TABLE "chat_message_recipients_user" DROP CONSTRAINT "FK_e4f2d4c1885d93c03c8e64f7b2a"
        `);
        await queryRunner.query(`
            ALTER TABLE "chat_message" DROP CONSTRAINT "FK_a2be22c99b34156574f4e02d0a0"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_8b47990872b34d2a885fae0756"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e4f2d4c1885d93c03c8e64f7b2"
        `);
        await queryRunner.query(`
            DROP TABLE "chat_message_recipients_user"
        `);
        await queryRunner.query(`
            DROP TABLE "chat_message"
        `);
    }

}
