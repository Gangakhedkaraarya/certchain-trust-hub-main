
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCertificates } from "@/contexts/CertificateContext";
import { useWeb3 } from "@/contexts/Web3Context";
import CertificateCard from "@/components/CertificateCard";
import { AlertTriangle, Award, Search } from "lucide-react";

const CertificatesPage = () => {
  const { certificates, issuedCertificates } = useCertificates();
  const { account, isIssuer } = useWeb3();
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  
  // Filter certificates based on search and filter
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = search === "" || 
      cert.name.toLowerCase().includes(search.toLowerCase()) ||
      cert.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      cert.issuerName.toLowerCase().includes(search.toLowerCase()) ||
      cert.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === "all" || 
      (filter === "verified" && cert.status === "verified") ||
      (filter === "pending" && cert.status === "pending") ||
      (filter === "revoked" && cert.status === "revoked");
    
    return matchesSearch && matchesFilter;
  });
  
  // Filter issued certificates for the connected account
  const filteredIssuedCertificates = issuedCertificates.filter(cert => {
    const matchesSearch = search === "" || 
      cert.name.toLowerCase().includes(search.toLowerCase()) ||
      cert.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      cert.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === "all" || 
      (filter === "verified" && cert.status === "verified") ||
      (filter === "pending" && cert.status === "pending") ||
      (filter === "revoked" && cert.status === "revoked");
    
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Certificate Registry</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse all certificates issued and verified through our blockchain platform. 
          These certificates are tamper-proof and instantly verifiable.
        </p>
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue={isIssuer ? "issued" : "all"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md mx-auto">
            <TabsTrigger value="all">All Certificates</TabsTrigger>
            <TabsTrigger value="issued" disabled={!isIssuer}>
              Issued by Me
            </TabsTrigger>
          </TabsList>
          
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Label htmlFor="search" className="text-sm font-medium">
                Search Certificates
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by name, recipient, issuer, or ID..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="filter" className="text-sm font-medium">
                Filter by Status
              </Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger id="filter" className="mt-1">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all">
            {filteredCertificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate) => (
                  <CertificateCard 
                    key={certificate.id} 
                    certificate={certificate} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Certificates Found</h3>
                <p className="text-gray-500">
                  {search ? 
                    "No certificates match your search criteria. Try adjusting your search." :
                    "There are no certificates available in this category."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="issued">
            {account ? (
              <>
                {filteredIssuedCertificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIssuedCertificates.map((certificate) => (
                      <CertificateCard 
                        key={certificate.id} 
                        certificate={certificate} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Issued Certificates</h3>
                    <p className="text-gray-500">
                      You haven't issued any certificates yet or none match your current filters.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Connect Wallet</h3>
                <p className="text-gray-500">
                  Please connect your wallet to view certificates you've issued.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CertificatesPage;
