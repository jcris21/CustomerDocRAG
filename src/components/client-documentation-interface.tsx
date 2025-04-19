"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, User, FileText, ChevronLeft, CheckCircle, Building2, Send, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { suggestReplies } from "@/ai/flows/suggest-replies"

export default function ClientDocumentationInterface() {  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<
    {
      type: "user" | "assistant"
      text: string
    }[]
  >([])
  const [selectedClient, setSelectedClient] = useState("Creative Media Group")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"documentation" | "timeline" | "profile">("documentation")
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([])

  const clients = [
    {
      id: 1,
      name: "John Doe",
      company: "TechSolutions Inc.",
      status: "Operations",
      lastUpdate: "Requirements update",
    },
    {
      id: 2,
      name: "Jane Smith",
      company: "Creative Media Group",
      status: "Onboarding",
      lastUpdate: "Implementation documents",
    },
    {
      id: 3,
      name: "Robert Johnson",
      company: "Global Retail",
      status: "Sales",
      lastUpdate: "Proposal sent",
    },
    {
      id: 4,
      name: "Emily Davis",
      company: "Healthcare Solutions",
      status: "Operations",
      lastUpdate: "Monthly report",
    },
  ]

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const clientDocuments = [
    { id: 1, title: "Initial Proposal", date: "03/15/2024", type: "Sales", status: "Approved" },
    { id: 2, title: "Signed Contract", date: "03/22/2024", type: "Sales", status: "Completed" },
    { id: 3, title: "Implementation Plan", date: "04/01/2024", type: "Onboarding", status: "In Progress" },
    { id: 4, title: "Technical Requirements", date: "04/05/2024", type: "Onboarding", status: "Pending Review" },
    { id: 5, title: "Progress Report", date: "04/12/2024", type: "Operations", status: "New" },
  ]

  const clientTimeline = [
    { id: 1, date: "03/15/2024", title: "First Contact", description: "Initial meeting to discuss needs" },
    { id: 2, date: "03/22/2024", title: "Contract Signing", description: "Approval of proposal and terms" },
    { id: 3, date: "04/01/2024", title: "Onboarding Start", description: "Implementation team assignment" },
    {
      id: 4,
      date: "04/05/2024",
      title: "Requirements Definition",
      description: "Documentation of technical specifications",
    },
    { id: 5, date: "04/12/2024", title: "Progress Review", description: "Presentation of progress to client" },
  ]

  const handleAsk = async () => {
    if (message.trim()) {
      const userMessage = message;
      setChatHistory((prev) => [...prev, { type: "user", text: userMessage }])
      setMessage("") // Clear input immediately

      // Send data to webhook
      const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: userMessage,
              clientName: selectedClient,
            }),
          });
          console.log('Webhook data sent successfully');
          const data = await response.json();
          console.log('Webhook response data:', data);
          if (data && data.output) {
            const aiResponse = data.output;
            setChatHistory((prev) => [...prev, { type: "assistant", text: aiResponse }]);
          } else {
            console.warn('Unexpected webhook response format:', data);
            setChatHistory((prev) => [...prev, { type: "assistant", text: 'No output returned from webhook' }]);
          }

        } catch (error) {
          console.error('Error sending data to webhook:', error);
          // Optionally, add error handling or user notification here
        }
      } else {
        console.warn('NEXT_PUBLIC_WEBHOOK_URL is not defined in environment variables.');
      }

      // Simulate AI response (replace with actual AI call if needed)
      // const aiResponse = `According to the client documentation, the main technical requirements for Creative Media Group's digital marketing platform are:

// Integration with their existing CRM systems (Salesforce)
// Capability to manage campaigns across multiple channels (email, social media, web)
// Customizable dashboard for real-time metrics analysis
// Compatibility with their current AWS infrastructure
// Compliance with GDPR regulations for European user data`
      // setChatHistory((prev) => [...prev, { type: "assistant", text: aiResponse }])

      // Generate suggested replies
      try {
        const replies = await suggestReplies({
          chatContext: userMessage, // Use the sent message for context
          customerHistory: "Client has been onboarded, signed contract on 03/22/2024",
        })
        setSuggestedReplies(replies.suggestedReplies)
      } catch (error) {
        console.error("Error generating suggested replies:", error)
        setSuggestedReplies(["Tell me more about the CRM integration", "What about GDPR compliance?", "How long will the implementation take?"])
      }
    }
  }

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages are added or updated
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAsk()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Sales":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Sales
          </Badge>
        )
      case "Onboarding":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Onboarding
          </Badge>
        )
      case "Operations":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Operations
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Function to get company initials
  const getCompanyInitials = (company: string) => {
    return company
      .split(/s+/)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const handleSuggestedReplyClick = (reply: string) => {
    setChatHistory((prev) => [...prev, { type: "user", text: reply }])
    const aiResponse = "OK. Here are the details."
    setChatHistory((prev) => [...prev, { type: "assistant", text: aiResponse }])
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col bg-card">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Clients</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              className="pl-8 rounded-md shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="w-full rounded-md">
                Clients
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            <ScrollArea className="flex-1 h-[calc(100vh-180px)]">
              <div className="p-2">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={cn(
                      `flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors mb-1`,
                      selectedClient === client.company
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                    onClick={() => setSelectedClient(client.company)}
                  >
                    <Avatar className="bg-muted">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getCompanyInitials(client.company)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{client.company}</p>
                        {getStatusBadge(client.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">Contact: {client.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">{client.lastUpdate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Client Documentation Area */}      
      <div className="flex-1 flex flex-col">
        {/* Client Header */}
        <div className="flex items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="text-primary font-medium">
                {getCompanyInitials(selectedClient)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{selectedClient}</h2>
                {getStatusBadge("Onboarding")}
              </div>
              <p className="text-sm text-muted-foreground">
                <User className="h-3 w-3 inline mr-1" />
                Jane Smith (Marketing Director)
              </p>
            </div>
          </div>
        </div>

        {/* Client Tabs */}
        <div className="border-b">
          <Tabs defaultValue="documentation" className="w-full" onValueChange={setActiveTab}>
            <div className="px-4">
              <TabsList className="w-full max-w-md mx-auto">
                <TabsTrigger value="documentation" className="flex-1 rounded-md">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Agent
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex-1 rounded-md">
                  <Clock className="h-4 w-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex-1 rounded-md">
                  <Building2 className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <TabsContent value="documentation" className="flex-1 p-4">
              {selectedClient ? (
                <div ref={chatContainerRef} id="n8n-chat-container">
                  <link
                    href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
                    rel="stylesheet"
                  />
                  <script type="module">
                    {`import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

                    createChat({
                      webhookUrl: 'https://x6fvvfce.rpcld.co/webhook/a4a36e6a-aa85-4c6b-bb98-da4b8e4cd33e/chat',
                    });`}
                  </script>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select a client to view documentation.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="p-6">
              {selectedClient ? (
                <>
                  <h3 className="text-lg font-medium mb-6">Client Timeline</h3>
                  <div className="relative border-l border-muted pl-6 ml-4">
                    {clientTimeline.map((event, index) => (
                      <div key={event.id} className={`mb-8 ${index === 0 ? "pt-2" : ""}`}>
                        <div className="absolute -left-2 mt-1.5 h-4 w-4 rounded-full border border-background bg-muted"></div>
                        <time className="mb-1 text-sm font-normal leading-none text-muted-foreground">{event.date}</time>
                        <h3 className="text-base font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select a client to view the timeline.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile" className="p-6">
              {selectedClient ? (
                <>
                  <h3 className="text-lg font-medium mb-6">Client Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="rounded-md shadow-sm">
                        <CardHeader>
                          <CardTitle>General Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                              <dd className="mt-1">{selectedClient}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Industry</dt>
                              <dd className="mt-1">Marketing and Advertising</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Primary Contact</dt>
                              <dd className="mt-1">Jane Smith (Marketing Director)</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                              <dd className="mt-1">jane.smith@creativemedia.com</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                              <dd className="mt-1">+1 (555) 123-4567</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>

                      <Card className="rounded-md shadow-sm">
                        <CardHeader>
                          <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Solution Type</dt>
                              <dd className="mt-1">Digital Marketing Platform</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
                              <dd className="mt-1">March 15, 2024</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Current Phase</dt>
                              <dd className="mt-1">Onboarding</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Project Manager</dt>
                              <dd className="mt-1">Carlos Rodriguez</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                              <dd className="mt-1 flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                In Progress
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select a client to view the profile.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      
    </div>
  )
}
          </div>

          {/* Tab Content */}
          <TabsContent value="documentation" className="flex-1 p-4">
            <div ref={chatContainerRef} id="n8n-chat-container">
              <link
                href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
                rel="stylesheet"
              />
              <script type="module">
                {`import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

                createChat({
                  webhookUrl: 'https://x6fvvfce.rpcld.co/webhook/a4a36e6a-aa85-4c6b-bb98-da4b8e4cd33e/chat',
                });`}
              </script>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="p-6">
            <h3 className="text-lg font-medium mb-6">Client Timeline</h3>
            <div className="relative border-l border-muted pl-6 ml-4">
              {clientTimeline.map((event, index) => (
                <div key={event.id} className={`mb-8 ${index === 0 ? "pt-2" : ""}`}>
                  <div className="absolute -left-2 mt-1.5 h-4 w-4 rounded-full border border-background bg-muted"></div>
                  <time className="mb-1 text-sm font-normal leading-none text-muted-foreground">{event.date}</time>
                  <h3 className="text-base font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="p-6">
            <h3 className="text-lg font-medium mb-6">Client Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-md shadow-sm">
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                        <dd className="mt-1">{selectedClient}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Industry</dt>
                        <dd className="mt-1">Marketing and Advertising</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Primary Contact</dt>
                        <dd className="mt-1">Jane Smith (Marketing Director)</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                        <dd className="mt-1">jane.smith@creativemedia.com</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                        <dd className="mt-1">+1 (555) 123-4567</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card className="rounded-md shadow-sm">
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Solution Type</dt>
                        <dd className="mt-1">Digital Marketing Platform</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
                        <dd className="mt-1">March 15, 2024</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Current Phase</dt>
                        <dd className="mt-1">Onboarding</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Project Manager</dt>
                        <dd className="mt-1">Carlos Rodriguez</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                        <dd className="mt-1 flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          In Progress
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
          </TabsContent>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Select a Client</h3>
            <p className="text-muted-foreground">Choose a company to view its documentation and history</p>
          </div>
        </div>
      )}
    </div>
  )
}
