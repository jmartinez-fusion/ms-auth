import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
export class Permissions1711547262501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const inserts = [
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'meta-users.create', 'Create Users')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'meta-users.update', 'Update Users')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'meta-users.view', 'View Users')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'meta-users.delete', 'Delete Users')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'meta-users.list', 'List Users')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'meta-users.status', 'Change Status Users')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'roles.list', 'List Roles')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'roles.create', 'Create Roles')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'roles.update', 'Update Roles')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'roles.view', 'View Roles')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'roles.delete', 'Delete Roles')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'permissions.list', 'List Permissions')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'projects.view', 'View Project')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'projects.list', 'List Projects')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'projects.create', 'Create Project')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'projects.update', 'Update Project')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'projects.delete', 'Delete Project')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'future-processes.create', 'Create Future Processes')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'future-processes.fill', 'Associate Future Process to Project')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'future-processes.list', 'List Future Processes')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'current-processes.create', 'Create Current Process')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'current-processes.list', 'List Current Process')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'current-processes.update', 'Update Current Process')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'current-processes.view', 'View Current Process')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'current-processes.delete', 'Delete Current Process')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'current-process-presentations.fill', 'Create Current Process Presentation')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'current-process-presentations.view', 'View Current Process Presentation')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'current-process-presentations.change-status', 'Change Current Process Presentation Status')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'current-process-presentations.reset', 'Reset Current Process Presentation')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'future-process-presentations.fill', 'Create Future Process Presentation')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'future-process-presentations.view', 'View Future Process Presentation')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'future-process-presentations.reset', 'Reset Future Process Presentation')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'future-process-presentations.change-status', 'Change Future Process Presentation Status')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'selected-future-processes.list', 'List Selected Future Processes')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'selected-future-processes.view', 'View Selected Future Processes')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'departments.upload', 'Upload Departments')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'departments.list', 'List Departments')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'departments.view', 'View Department')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'positions.list', 'List positions')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'positions.upload', 'Upload positions')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'sprints.list', 'List sprints')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'sprints.view', 'View sprint')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'sprints.create', 'Create sprint')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'sprints.update', 'Update sprint')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'sprints.delete', 'Delete sprint')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'stakeholders.list', 'List stakeholders')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'stakeholders.view', 'View stakeholder')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'stakeholders.upload', 'Upload stakeholders')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'process-mappings.list', 'List Process Mapping')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'process-mappings.view', 'View Process Mapping')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'process-mappings.upload', 'Upload Process Mapping')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'stakeholders.activate-user', 'Stakeholders activate user')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'influencers.list', 'List Influencers')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'influencers.view', 'View Influencer')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'influencers.upload', 'Upload Influencers')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'influencers.update', 'Update Influencer')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'tags.list', 'List Tag')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'categories.list', 'List Category')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'question-banks.list', 'List Quiestion bank')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'text-blocks.list', 'List Text block')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'text-blocks.create', 'Create Text block')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'text-blocks.update', 'Update Text block')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'text-blocks.view', 'View Test blok')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'surveys.list', 'List Survey')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'surveys.create', 'Create Survey')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'surveys.view', 'View Survey')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'surveys.pause', 'Pause Survey')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'surveys.close', 'Close Survey')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'surveys.generic-update', 'Generic update Survey')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'surveys.deadline-update', 'Deadline Survey')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'mail-settings.view', 'View Mail Setting Configuration')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'mail-settings.set', 'Set Mail Setting Configuration')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'project-roles.update', 'Update Project Roles')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'project-roles.list', 'List Project Roles')`,
      `INSERT INTO auth_permission (id, created_at, updated_at, name, label) VALUES ('${uuidv4()}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'client-users.list', 'List Client Users')`,
    ];
    for (const insert of inserts) {
      await queryRunner.query(insert);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
