import { ProductAvailabilityTool } from "@/components/product/ProductAvailabilityTool";
import { ProductPopularityTool } from "@/components/product/ProductPopularityTool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageSearch, BarChart3 } from "lucide-react";

export default function ProductToolsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">Product Insight Tools</h1>
      
      <Tabs defaultValue="availability" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="availability" className="flex items-center gap-2 py-2.5">
            <PackageSearch className="h-5 w-5" />
            Availability Check
          </TabsTrigger>
          <TabsTrigger value="popularity" className="flex items-center gap-2 py-2.5">
            <BarChart3 className="h-5 w-5" />
            Popularity Analysis
          </TabsTrigger>
        </TabsList>
        <TabsContent value="availability">
          <ProductAvailabilityTool />
        </TabsContent>
        <TabsContent value="popularity">
          <ProductPopularityTool />
        </TabsContent>
      </Tabs>
    </div>
  );
}
