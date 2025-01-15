/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary(); // Primary Key
    table.string('deadline').notNullable(); // Deadline
    table.text('notes'); // Description
    table.integer('quantity').notNullable(); // Quantity
    table.text('reason');

    table
      .enum('status', ['pending', 'accepted', 'declined', 'completed'])
      .defaultTo('pending'); // Status
    table.integer('farmerId').unsigned().references('id').inTable('users'); // Foreign Key
    table.timestamps(true, true); // Timestamps
  });

  // Seed initial orders
  await knex('orders').insert([
    {
      deadline: '2025-01-15',
      notes: 'First Order',
      quantity: 10,
      status: 'pending',
      farmerId: 2,
    },
    {
      deadline: '2025-01-20',
      notes: 'Second Order',
      quantity: 20,
      status: 'accepted',
      farmerId: 2,
    },
    {
      deadline: '2025-01-25',
      notes: 'Third Order',
      quantity: 30,
      status: 'declined',
      farmerId: 2,
    },
    {
      deadline: '2025-01-30',
      notes: 'Fourth Order',
      quantity: 40,
      status: 'completed',
      farmerId: 5,
    },
    {
      deadline: '2025-02-01',
      notes: 'Fifth Order',
      quantity: 50,
      status: 'pending',
      farmerId: 5,
    },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('orders');
};
