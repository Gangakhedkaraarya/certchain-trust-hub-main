
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCertificates } from "@/contexts/CertificateContext";
import { useIPFS } from "@/contexts/IPFSContext";
import { Loader2, Search, Upload, AlertTriangle, Check, FileText, Shield } from "lucide-react";

const VerifyPage = () => {
  const [certificateId, setCertificateId] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<"success" | "error" | "none">("none");
  const [verifiedCertificateId, setVerifiedCertificateId] = useState<string | null>(null);
  const { verifyCertificate, getCertificate, loading } = useCertificates();
  const { isUploading } = useIPFS();
  const navigate = useNavigate();
  
  const handleIdVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) return;
    
    setVerificationResult("none");
    const result = await verifyCertificate(certificateId);
    setVerificationResult(result ? "success" : "error");
    
    if (result) {
      setVerifiedCertificateId(certificateId);
    }
  };
  
  const handleFileVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;
    
    // In a real application, this would compute the hash of the uploaded file
    // and compare it with blockchain records
    // For demo, we'll simulate a verification process
    
    setVerificationResult("none");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification - randomly succeed or fail for demo purposes
    const success = Math.random() > 0.3;
    setVerificationResult(success ? "success" : "error");
    
    if (success) {
      // For demo, we'll just pick a random certificate ID as if we found a match
      const mockCertIds = ["cert-001", "cert-002", "cert-003"];
      const foundCertId = mockCertIds[Math.floor(Math.random() * mockCertIds.length)];
      setVerifiedCertificateId(foundCertId);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleViewCertificate = () => {
    if (verifiedCertificateId) {
      navigate(`/certificate/${verifiedCertificateId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Verify Certificate</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Instantly verify the authenticity of any certificate issued through our platform 
            using either the certificate ID or by uploading the certificate file.
          </p>
        </div>
        
        <Tabs defaultValue="id" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="id">Verify by ID</TabsTrigger>
            <TabsTrigger value="file">Verify by File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="id">
            <Card>
              <CardHeader>
                <CardTitle>Certificate ID Verification</CardTitle>
                <CardDescription>
                  Enter the unique certificate ID to verify its authenticity on the blockchain.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleIdVerify}>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="certificateId">Certificate ID</Label>
                      <Input
                        id="certificateId"
                        placeholder="e.g., cert-001"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || !certificateId.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Verify Certificate
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>File Upload Verification</CardTitle>
                <CardDescription>
                  Upload the certificate file to verify its authenticity against blockchain records.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleFileVerify}>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="certificateFile">Certificate File</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          id="certificateFile"
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="certificateFile"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          {file ? (
                            <span className="text-sm font-medium text-gray-900">
                              {file.name}
                            </span>
                          ) : (
                            <>
                              <span className="text-sm font-medium text-gray-900">
                                Drop your certificate file here, or{" "}
                                <span className="text-brand-600">browse</span>
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                Supports PDF, JPG, JPEG, PNG
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isUploading || !file}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Verify File
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Verification Results */}
        {verificationResult !== "none" && (
          <div className="mt-8">
            {verificationResult === "success" ? (
              <div className="bg-white border border-green-200 rounded-lg overflow-hidden">
                <div className="bg-green-50 px-6 py-4 flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Certificate Verified Successfully
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">
                      This certificate has been verified on the blockchain and is authentic.
                    </p>
                  </div>
                </div>
                
                {verifiedCertificateId && getCertificate(verifiedCertificateId) && (
                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {getCertificate(verifiedCertificateId)?.name}
                      </h4>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>
                          <span className="font-medium">Issued to:</span>{" "}
                          {getCertificate(verifiedCertificateId)?.recipientName}
                        </p>
                        <p>
                          <span className="font-medium">Issued by:</span>{" "}
                          {getCertificate(verifiedCertificateId)?.issuerName}
                        </p>
                        <p>
                          <span className="font-medium">Issue Date:</span>{" "}
                          {new Date(getCertificate(verifiedCertificateId)?.issueDate || "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <Button onClick={handleViewCertificate} className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      View Certificate Details
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertTriangle className="h-5 w-5" />
                <AlertDescription className="flex flex-col">
                  <span className="font-semibold text-lg text-red-800">Verification Failed</span>
                  <span className="text-red-700">
                    We could not verify this certificate. It may be invalid, tampered with, or not issued through our system.
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
