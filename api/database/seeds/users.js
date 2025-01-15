/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  await knex('users').insert([
    {
      username: 'adminUser',
      password: '$2b$12$DUMMYHASH1', // Replace with a hashed password
      fullName: 'Admin User',
      phone: '1234567890',
      address: '123 Admin St.',
      roleId: 1,
      status: 'Active',
    },
    {
      username: 'farmerUser',
      password: '$2b$12$DUMMYHASH2', // Replace with a hashed password
      fullName: 'Farmer User',
      phone: '9876543210',
      address: '456 Farmer Lane',
      roleId: 2,
      status: 'Active',
    },
    {
      username: 'salesmanUser',
      password: '$2b$12$DUMMYHASH3', // Replace with a hashed password
      fullName: 'Salesman User',
      phone: '5556667777',
      address: '789 Sales Ave',
      roleId: 3,
      status: 'Active',
    },
    {
      username: 'customerUser',
      password: '$2b$12$DUMMYHASH4', // Replace with a hashed password
      fullName: 'Customer User',
      phone: '4443332222',
      address: '101 Customer Blvd',
      roleId: 4,
      status: 'Active',
    },
  ]);
};
