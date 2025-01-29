/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('inventory', (table) => {
    table.increments('id').primary(); // Primary Key
    table.integer('total').notNullable(); // Quantity
    table.integer('damaged').notNullable();
    table.text('note'); // Description
    table.integer('orderId').unsigned().references('id').inTable('orders');
    table.timestamps(true, true); // Timestamps
  });

  // Seed initial inventory
  await knex('inventory').insert([
    { total: 100, damaged: 5, note: 'Inventory for Order 1', orderId: 1 },
    { total: 200, damaged: 10, note: 'Inventory for Order 2', orderId: 2 },
    { total: 300, damaged: 15, note: 'Inventory for Order 3', orderId: 3 },
    { total: 400, damaged: 20, note: 'Inventory for Order 4', orderId: 4 },
    { total: 500, damaged: 25, note: 'Inventory for Order 5', orderId: 5 },
  ]);

  await knex.schema.createTable('replacements', (table) => {
    table.increments('id').primary(); // Primary Key
    table.integer('quantity').notNullable(); // Quantity
    table.string('deadline').notNullable(); // Deadline
    table.text('reason'); // Description
    table.string('image');
    table
      .enum('status', ['pending', 'approved', 'delivered'])
      .defaultTo('pending'); // Status
    table
      .integer('orderId')
      .unsigned()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.timestamps(true, true); // Timestamps
  });

  // Seed initial replacements
  await knex('replacements').insert([
    {
      quantity: 5,
      deadline: '2025-01-17',
      reason: 'Damage replacement',
      status: 'pending',
      orderId: 1,
    },
    {
      quantity: 10,
      deadline: '2025-01-22',
      reason: 'Additional order',
      status: 'approved',
      orderId: 2,
    },
    {
      quantity: 15,
      deadline: '2025-01-27',
      reason: 'Misplacement',
      status: 'delivered',
      orderId: 3,
    },
    {
      quantity: 20,
      deadline: '2025-02-02',
      reason: 'Customer request',
      status: 'pending',
      orderId: 4,
    },
    {
      quantity: 25,
      deadline: '2025-02-07',
      reason: 'Quality issue',
      status: 'approved',
      orderId: 5,
    },
  ]);

  await knex.schema.createTable('productions', (table) => {
    table.increments('id').primary(); // Primary Key
    table.integer('cartoon').defaultTo(0); // Cartoon
    table.integer('tray').defaultTo(0); // tray
    table.integer('piece').defaultTo(0); // piece
    table
      .integer('farmerId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('inventory');
  await knex.schema.dropTable('productions');
};
