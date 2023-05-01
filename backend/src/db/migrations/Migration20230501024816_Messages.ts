import { Migration } from '@mikro-orm/migrations';

export class Migration20230501024816 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "message" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "from_sender_id" int not null, "to_receiver_id" int not null, "message" varchar(255) not null);');

    this.addSql('alter table "message" add constraint "message_from_sender_id_foreign" foreign key ("from_sender_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_to_receiver_id_foreign" foreign key ("to_receiver_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "message" cascade;');
  }

}
