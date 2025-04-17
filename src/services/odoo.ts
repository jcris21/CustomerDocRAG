/**
 * Represents a customer object.
 */
export interface Customer {
  /**
   * The unique identifier for the customer.
   */
  id: string;
  /**
   * The name of the customer.
   */
  name: string;
  /**
   * The email address of the customer.
   */
  email: string;
}

/**
 * Asynchronously retrieves a list of customers.
 *
 * @returns A promise that resolves to an array of Customer objects.
 */
export async function getCustomers(): Promise<Customer[]> {
  // TODO: Implement this by calling the Odoo API.

  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
  ];
}
