export async function up(knex) {
  await knex.schema.alterTable('users', function (table) {
    table.dropColumn('text')
    table.string('email').unique().notNullable();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
  })
}

export async function down(knex) {
  await knex.schema.alterTable('users', function (table) {
    table.string('text')
    table.dropColumn('email')
    table.dropColumn('password')
  })
}
