// Create Users Table
exports.up = async function (knex) {
  await knex.schema.createTable('roles', (table) => {
    table.increments('id').primary();
    table.string('name').unique().notNullable();
  });

  // Seed initial roles
  await knex('roles').insert([
    { name: 'admin' },
    { name: 'farmer' },
    { name: 'salesman' },
    { name: 'customer' },
  ]);

  // Create Users Table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // Primary Key
    table.string('username').notNullable().unique(); // Username
    table.string('password').notNullable(); // Hashed Password
    table.string('fullName').notNullable(); // Full Name
    table.string('phone'); // Optional Phone Number
    table.string('address'); // Optional Address
    table.integer('roleId').unsigned().references('id').inTable('roles'); // Foreign Key
    table.enum('status', ['Active', 'Inactive']).defaultTo('Active'); // Status
    table.timestamps(true, true); // Timestamps
  });

  // Seed initial users
  // Seed initial users
  await knex('users').insert([
    {
      username: 'admin1',
      password: '$2b$12$WohFnCdXmR6eO7Z3OfAXT.lPUvEoSZaBeYMEViAnMYht5IdWSgwDW',
      fullName: 'Admin One',
      roleId: 1,
      status: 'Active',
    },
    {
      username: 'Haleeya',
      password: '$2b$12$WohFnCdXmR6eO7Z3OfAXT.lPUvEoSZaBeYMEViAnMYht5IdWSgwDW',
      fullName: 'Farmer One',
      roleId: 2,
      status: 'Active',
    },
    {
      username: 'Cali',
      password: '$2b$12$WohFnCdXmR6eO7Z3OfAXT.lPUvEoSZaBeYMEViAnMYht5IdWSgwDW',
      fullName: 'Cali Maxamed',
      roleId: 3,
      status: 'Active',
    },
    {
      username: 'customer1',
      password: 'hashedpassword4',
      fullName: 'Customer One',
      roleId: 4,
      status: 'Active',
    },
    {
      username: 'guest1',
      password: 'hashedpassword5',
      fullName: 'Guest One',
      roleId: 2,
      status: 'Active',
    },
  ]);
};

exports.down = async function (knex) {
  // await knex.schema.dropTable('users');
  await knex.schema.dropTable('roles');
};
