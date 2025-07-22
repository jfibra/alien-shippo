import { SiteAudit } from "@/components/site-audit"
import { MockDataDetector } from "@/components/mock-data-detector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuditPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="full-audit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="full-audit">Full Site Audit</TabsTrigger>
          <TabsTrigger value="mock-data">Mock Data Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="full-audit">
          <SiteAudit />
        </TabsContent>

        <TabsContent value="mock-data">
          <MockDataDetector />
        </TabsContent>
      </Tabs>
    </div>
  )
}
