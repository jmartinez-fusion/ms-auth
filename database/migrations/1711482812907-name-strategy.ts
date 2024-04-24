import { MigrationInterface, QueryRunner } from 'typeorm';

export class NameStrategy1711482812907 implements MigrationInterface {
  name = 'NameStrategy1711482812907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`auth_permission\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`label\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auth_role\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auth_user_session\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`expires_at\` timestamp NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auth_user\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`type\` varchar(255) NOT NULL, \`is_admin\` tinyint NOT NULL DEFAULT 0, \`is_visible\` tinyint NOT NULL DEFAULT 1, \`MetaField\` varchar(255) NULL, \`clientField\` varchar(255) NULL, UNIQUE INDEX \`IDX_3d29d788cd69d1ddf87e88e01e\` (\`email\`), INDEX \`IDX_de33453e4e4109ce79fb6a6215\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auth_user_activation_code\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`code\` varchar(6) NOT NULL, \`expiration_date\` timestamp NOT NULL, \`user_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_3c0e05c037eb3258881d84d86b\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auth_auth_role_permissions_auth_permission\` (\`authRoleId\` varchar(36) NOT NULL, \`authPermissionId\` varchar(36) NOT NULL, INDEX \`IDX_4110e4ece18431f71b6bb13431\` (\`authRoleId\`), INDEX \`IDX_222d13a9a44f2ae50d4bbe6e67\` (\`authPermissionId\`), PRIMARY KEY (\`authRoleId\`, \`authPermissionId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auth_auth_user_roles_auth_role\` (\`authUserId\` varchar(36) NOT NULL, \`authRoleId\` varchar(36) NOT NULL, INDEX \`IDX_1258ca1b80f09a68e588e5a4f3\` (\`authUserId\`), INDEX \`IDX_2ecca65a1ea0f85f9f1fc409a5\` (\`authRoleId\`), PRIMARY KEY (\`authUserId\`, \`authRoleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_user_session\` ADD CONSTRAINT \`FK_93d4c226b8f8b03f75c04e3a093\` FOREIGN KEY (\`userId\`) REFERENCES \`auth_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_user_activation_code\` ADD CONSTRAINT \`FK_8d2a67ce70c390af0d4f1f6b395\` FOREIGN KEY (\`user_id\`) REFERENCES \`auth_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_auth_role_permissions_auth_permission\` ADD CONSTRAINT \`FK_4110e4ece18431f71b6bb134310\` FOREIGN KEY (\`authRoleId\`) REFERENCES \`auth_role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_auth_role_permissions_auth_permission\` ADD CONSTRAINT \`FK_222d13a9a44f2ae50d4bbe6e674\` FOREIGN KEY (\`authPermissionId\`) REFERENCES \`auth_permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_auth_user_roles_auth_role\` ADD CONSTRAINT \`FK_1258ca1b80f09a68e588e5a4f3f\` FOREIGN KEY (\`authUserId\`) REFERENCES \`auth_user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_auth_user_roles_auth_role\` ADD CONSTRAINT \`FK_2ecca65a1ea0f85f9f1fc409a57\` FOREIGN KEY (\`authRoleId\`) REFERENCES \`auth_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_auth_user_roles_auth_role\` DROP FOREIGN KEY \`FK_2ecca65a1ea0f85f9f1fc409a57\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_auth_user_roles_auth_role\` DROP FOREIGN KEY \`FK_1258ca1b80f09a68e588e5a4f3f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_auth_role_permissions_auth_permission\` DROP FOREIGN KEY \`FK_222d13a9a44f2ae50d4bbe6e674\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_auth_role_permissions_auth_permission\` DROP FOREIGN KEY \`FK_4110e4ece18431f71b6bb134310\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_user_activation_code\` DROP FOREIGN KEY \`FK_8d2a67ce70c390af0d4f1f6b395\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_user_session\` DROP FOREIGN KEY \`FK_93d4c226b8f8b03f75c04e3a093\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2ecca65a1ea0f85f9f1fc409a5\` ON \`auth_auth_user_roles_auth_role\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1258ca1b80f09a68e588e5a4f3\` ON \`auth_auth_user_roles_auth_role\``,
    );
    await queryRunner.query(`DROP TABLE \`auth_auth_user_roles_auth_role\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_222d13a9a44f2ae50d4bbe6e67\` ON \`auth_auth_role_permissions_auth_permission\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4110e4ece18431f71b6bb13431\` ON \`auth_auth_role_permissions_auth_permission\``,
    );
    await queryRunner.query(
      `DROP TABLE \`auth_auth_role_permissions_auth_permission\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3c0e05c037eb3258881d84d86b\` ON \`auth_user_activation_code\``,
    );
    await queryRunner.query(`DROP TABLE \`auth_user_activation_code\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_de33453e4e4109ce79fb6a6215\` ON \`auth_user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3d29d788cd69d1ddf87e88e01e\` ON \`auth_user\``,
    );
    await queryRunner.query(`DROP TABLE \`auth_user\``);
    await queryRunner.query(`DROP TABLE \`auth_user_session\``);
    await queryRunner.query(`DROP TABLE \`auth_role\``);
    await queryRunner.query(`DROP TABLE \`auth_permission\``);
  }
}
