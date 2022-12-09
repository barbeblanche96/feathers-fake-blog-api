const UUID_AUTOGENERATE = "(lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || '4' || substr(hex( randomblob(2)), 2) || '-' || substr('AB89', 1 + (abs(random()) % 4) , 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))))";

export async function up(knex) {
  await knex.schema.createTable('todos', (table) => {
    table.uuid("id").primary().defaultTo(knex.raw(UUID_AUTOGENERATE));
    table.text('description').notNullable();
    table.string('title').unique().notNullable();
    table.datetime('begined_at');
    table.datetime('finished_at');
    table.datetime('deadline_at').notNullable();
    table.enu('priority', ['low', 'medium', 'high']).notNullable();
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('users.id');
    table.timestamps(true, true);
  })
}

export async function down(knex) {
  await knex.schema.dropTable('todos')
}
