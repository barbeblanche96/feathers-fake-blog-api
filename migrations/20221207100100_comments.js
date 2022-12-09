const UUID_AUTOGENERATE = "(lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || '4' || substr(hex( randomblob(2)), 2) || '-' || substr('AB89', 1 + (abs(random()) % 4) , 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))))";

export async function up(knex) {
  await knex.schema.createTable('comments', (table) => {
    table.uuid("id").primary().defaultTo(knex.raw(UUID_AUTOGENERATE));
    table.text('content').notNullable();
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('users.id');
    table.uuid('post_id').notNullable();
    table.foreign('post_id').references('posts.id');
    table.timestamps(true, true);
  })
}

export async function down(knex) {
  await knex.schema.dropTable('comments')
}
