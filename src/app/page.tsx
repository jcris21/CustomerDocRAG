"use client"

import type React from "react"

import {useState} from "react"
import {Search, Clock, User, FileText, ChevronLeft, CheckCircle, Building2, MessageCircle} from "lucide-react"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"

export default function ClientDocumentationInterface() {
  const [message, setMessage] = useState("")
  const [selectedClient, setSelectedClient] = useState("Creative Media Group")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("documentation")

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
    {id: 1, title: "Initial Proposal", date: "03/15/2024", type: "Sales", status: "Approved"},
    {id: 2, title: "Signed Contract", date: "03/22/2024", type: "Sales", status: "Completed"},
    {
      id: 3,
      title: "Implementation Plan",
      date: "04/01/2024",
      type: "Onboarding",
      status: "In Progress",
    },
    {
      id: 4,
      title: "Technical Requirements",
      date: "04/05/2024",
      type: "Onboarding",
      status: "Pending Review",
    },
    {id: 5, title: "Progress Report", date: "04/12/2024", type: "Operations", status: "New"},
  ]

  const clientTimeline = [
    {id: 1, date: "03/15/2024", title: "First Contact", description: "Initial meeting to discuss needs"},
    {id: 2, date: "03/22/2024", title: "Contract Signing", description: "Approval of proposal and terms"},
    {id: 3, date: "04/01/2024", title: "Onboarding Start", description: "Implementation team assignment"},
    {
      id: 4,
      date: "04/05/2024",
      title: "Requirements Definition",
      description: "Documentation of technical specifications",
    },
    {id: 5, date: "04/12/2024", title: "Progress Review", description: "Presentation of progress to client"},
  ]

  const handleAddNote = () => {
    if (message.trim()) {
      // Logic to add note would go here
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddNote()
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
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

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
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="w-full">
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
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      selectedClient === client.company ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
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
      {selectedClient ? (
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
                  <TabsTrigger value="documentation" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Agent
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex-1">
                    <Clock className="h-4 w-4 mr-2" />
                    Timeline
                  </TabsTrigger>
                   <TabsTrigger value="profile" className="flex-1">
                    <Building2 className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === "documentation" && (
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">AI Assistant - Client Documentation</h3>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Original Documents
                  </Button>
                </div>

                <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                    <div className="bg-muted p-3 rounded-lg max-w-[85%]">
                      <p className="text-sm font-medium mb-1">AI Assistant</p>
                      <p>
                        Hello, I'm your AI assistant. I can answer questions about {selectedClient}'s documentation. How
                        can I help you today?
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[85%]">
                        <p>What are the main technical requirements for the project?</p>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg max-w-[85%]">
                      <p className="text-sm font-medium mb-1">AI Assistant</p>
                      <p>
                        According to the client documentation, the main technical requirements for {selectedClient}'s
                        digital marketing platform are:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Integration with their existing CRM systems (Salesforce)</li>
                        <li>Capability to manage campaigns across multiple channels (email, social media, web)</li>
                        <li>Customizable dashboard for real-time metrics analysis</li>
                        <li>Compatibility with their current AWS infrastructure</li>
                        <li>Compliance with GDPR regulations for European user data</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sources: Technical Requirements Document (04/05/2024), Initial Meeting Minutes (03/15/2024)
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[85%]">
                        <p>What is the implementation timeline?</p>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg max-w-[85%]">
                      <p className="text-sm font-medium mb-1">AI Assistant</p>
                      <p>The implementation timeline agreed with {selectedClient} is as follows:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Phase 1 (April-May): Initial setup and CRM integration</li>
                        <li>Phase 2 (June-July): Dashboard development and analytics tools</li>
                        <li>Phase 3 (August): Final testing and adjustments</li>
                        <li>Launch: Scheduled for early September</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sources: Implementation Plan (04/01/2024), Contract (03/22/2024)
                      </p>
                    </div>
                  </div>
                </ScrollArea>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Ask a question about this client's documentation..." className="flex-1" />
                    <Button>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Ask
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="p-6">
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
              </div>
            )}

            {activeTab === "profile" && (
              <div className="p-6">
                <h3 className="text-lg font-medium mb-6">Client Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
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

                  <Card>
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
              </div>
            )}
          </div>
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
