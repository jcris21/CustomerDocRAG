"use client";

import {useState, useEffect} from 'react';
import {getCustomers, Customer} from '@/services/odoo';
import {triggerN8nWorkflow} from '@/services/n8n';
import {suggestReplies} from '@/ai/flows/suggest-replies';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const fetchedCustomers = await getCustomers();
      setCustomers(fetchedCustomers);
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const updateSuggestions = async () => {
      if (selectedCustomer) {
        // Mock chat context and customer history for now
        const chatContext = chatMessages.join('\n');
        const customerHistory = `Customer ID: ${selectedCustomer.id}, Name: ${selectedCustomer.name}, Email: ${selectedCustomer.email}`;

        const suggestions = await suggestReplies({chatContext, customerHistory});
        setSuggestedReplies(suggestions.suggestedReplies);
      }
    };

    updateSuggestions();
  }, [chatMessages, selectedCustomer]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    // Clear chat messages when a new customer is selected
    setChatMessages([]);
  };

  const handleSendMessage = async () => {
    if (messageInput && selectedCustomer) {
      setChatMessages([...chatMessages, `You: ${messageInput}`]);

      // Trigger n8n workflow
      const workflowData = {
        customerId: selectedCustomer.id,
        message: messageInput,
      };
      const success = await triggerN8nWorkflow('your_workflow_id', workflowData);

      if (success) {
        setChatMessages(prevMessages => [...prevMessages, `OdooConcept: Message sent to workflow`]);
      } else {
        setChatMessages(prevMessages => [...prevMessages, `OdooConcept: Failed to trigger workflow`]);
      }
      setMessageInput('');
    }
  };

  return (
    <div className="flex h-screen bg-secondary">
      {/* Customer List */}
      <div className="w-1/4 p-4 border-r border-border">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Input type="search" placeholder="Search customers..." className="mb-2"/>
            <ScrollArea className="h-[calc(100vh-150px)] w-full rounded-md border">
              <div className="p-2">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-2 rounded hover:bg-accent cursor-pointer ${selectedCustomer?.id === customer.id ? 'bg-accent' : ''}`}
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    {customer.name}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 p-4">
        {selectedCustomer ? (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Chat with {selectedCustomer.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 mb-4">
                <div className="flex flex-col">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg mb-2 w-fit max-w-[75%] shadow-md ${message.startsWith('You:') ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary text-foreground mr-auto'}`}
                    >
                      {message}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Suggested Replies */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Suggested Replies:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedReplies.map((reply, index) => (
                    <Button key={index} variant="outline" size="sm" onClick={() => setMessageInput(reply)}>
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 mr-2"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-muted-foreground">Select a customer to start a chat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
