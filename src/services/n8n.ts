/**
 * Interface representing the structure of data expected by the n8n workflow trigger.
 */
export interface N8nWorkflowData {
  /**
   * The ID of the customer associated with the event.
   */
  customerId: string;
  /**
   * The chat message or event data to be processed by the workflow.
   */
  message: string;
}

/**
 * Asynchronously triggers an n8n workflow with the provided data.
 *
 * @param workflowId The ID of the n8n workflow to trigger.
 * @param data The data to send to the n8n workflow.
 * @returns A promise that resolves to true if the trigger was successful, false otherwise.
 */
export async function triggerN8nWorkflow(
  workflowId: string,
  data: N8nWorkflowData
): Promise<boolean> {
  // TODO: Implement this by calling the n8n API.
  console.log(`Triggering n8n workflow ${workflowId} with data:`, data);

  return true;
}
