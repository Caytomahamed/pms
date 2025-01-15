  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.up = async function (knex) {
    await knex.schema.createTable('sales', (table) => {
      table.increments('id').primary(); // Primary Key
      table.integer('quantity').notNullable(); // Quantity
      table.string('estimatedPrice').notNullable();
      table.string('deadline').notNullable(); // Deadline
      table.string('actualQuantity');
      table.string('actualPrice');

      table.enum('status', ['in_progress', 'completed']).defaultTo('in_progress'); // Status
      table.integer('salesmanId').unsigned().references('id').inTable('users'); // Foreign Key
      table.integer('customerId').unsigned().references('id').inTable('users'); // Foreign Key
      table.timestamps(true, true); // Timestamps
    });

    // Seed initial sales
    await knex('sales').insert([
      {
        quantity: 10,
        estimatedPrice: '100',
        deadline: '2025-01-15',
        status: 'in_progress',
        salesmanId: 3,
        customerId: 4,
      },
      {
        quantity: 20,
        estimatedPrice: '200',
        deadline: '2025-01-20',
        status: 'completed',
        salesmanId: 3,
        customerId: 4,
      },
      {
        quantity: 30,
        estimatedPrice: '300',
        deadline: '2025-01-25',
        status: 'in_progress',
        salesmanId: 3,
        customerId: 4,
      },
      {
        quantity: 40,
        estimatedPrice: '400',
        deadline: '2025-01-30',
        status: 'completed',
        salesmanId: 3,
        customerId: 4,
      },
      {
        quantity: 50,
        estimatedPrice: '500',
        deadline: '2025-02-01',
        status: 'in_progress',
        salesmanId: 3,
        customerId: 4,
      },
    ]);
  };

  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.schema.dropTable('sales');
  };
