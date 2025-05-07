"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationsContent() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("all")

  return (
    <main className={`border-x border-gray-200 dark:border-gray-800 ${isMobile ? "flex-1" : "w-[600px]"}`}>
      {/* Encabezado fijo */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Notifications</h1>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Notifications Settings</span>
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full justify-between bg-transparent">
            <TabsTrigger
              value="all"
              className="flex-1 rounded-none border-0 py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="mentions"
              className="flex-1 rounded-none border-0 py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Mentions
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              className="flex-1 rounded-none border-0 py-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Verified
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0 flex flex-col items-center justify-center h-full">
            <div className="text-3xl font-bold">
              <h1>Not implemented 
                <br /> &mdash; yet</h1>
            </div>
            <p className="text-gray-400 mt-2 text-lg">This section is not available yet.</p>
          </TabsContent>


          <TabsContent value="mentions" className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0 flex flex-col items-center justify-center h-full">
            <div className="text-3xl font-bold">
              <h1>Not implemented 
                <br /> &mdash; yet</h1>
            </div>
            <p className="text-gray-400 mt-2 text-lg">This section is not available yet.</p>
          </TabsContent>

          <TabsContent value="verified" className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0 flex flex-col items-center justify-center h-full">
            <div className="text-3xl font-bold">
              <h1>Not implemented 
                <br /> &mdash; yet</h1>
            </div>
            <p className="text-gray-400 mt-2 text-lg">This section is not available yet.</p>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}