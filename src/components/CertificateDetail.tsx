
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Certificate, useCertificates } from "@/contexts/CertificateContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { 
  Award, 
  Calendar, 
  FileText, 
  User, 
  Shield, 
  FileCheck, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  Download,
  Building,
  GraduationCap,
  Hash
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const CertificateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCertificate, verifyCertificate, revokeCertificate, loading } = useCertificates();
  const { account } = useWeb3();
  
  // Get certificate by ID
  const certificate = getCertificate(id || "");
  
  if (!certificate) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Certificate Not Found</AlertTitle>
          <AlertDescription>
            The certificate you are looking for does not exist or has been removed.
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  // Format display date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Handle certificate verification
  const handleVerify = async () => {
    await verifyCertificate(certificate.id);
  };
  
  // Handle certificate revocation (only by issuer)
  const handleRevoke = async () => {
    if (window.confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) {
      await revokeCertificate(certificate.id);
    }
  };
  
  // Handle certificate download (mock functionality)
  const handleDownload = () => {
    toast.success("Preparing certificate for download...");
    setTimeout(() => {
      toast.info("This is a demo - in a real application, the certificate would be downloaded from IPFS");
    }, 2000);
  };
  
  const getStatusDisplay = () => {
    switch (certificate.status) {
      case "verified":
        return (
          <div className="flex items-center text-green-700 bg-green-50 px-4 py-2 rounded-md">
            <Shield className="h-5 w-5 mr-2" />
            <span>Verified on Blockchain</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center text-yellow-700 bg-yellow-50 px-4 py-2 rounded-md">
            <Clock className="h-5 w-5 mr-2" />
            <span>Verification Pending</span>
          </div>
        );
      case "revoked":
        return (
          <div className="flex items-center text-red-700 bg-red-50 px-4 py-2 rounded-md">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Certificate Revoked</span>
          </div>
        );
      case "invalid":
        return (
          <div className="flex items-center text-red-700 bg-red-50 px-4 py-2 rounded-md">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Certificate Invalid</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  const isIssuer = certificate.issuerAddress === account;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{certificate.name}</h1>
        <p className="text-gray-500 mt-1">{certificate.metadata.description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-brand-500 to-accent-600 text-white px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold">{certificate.name}</h2>
                  <p className="opacity-90 text-sm mt-1">{certificate.metadata.title}</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  {getStatusDisplay()}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-500">Recipient</h3>
                    </div>
                    <p className="text-gray-900 mt-1">{certificate.recipientName}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-500">Issuer</h3>
                    </div>
                    <p className="text-gray-900 mt-1">{certificate.issuerName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-500">Issue Date</h3>
                    </div>
                    <p className="text-gray-900 mt-1">{formatDate(certificate.issueDate)}</p>
                  </div>
                  
                  {certificate.expiryDate && (
                    <div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                      </div>
                      <p className="text-gray-900 mt-1">{formatDate(certificate.expiryDate)}</p>
                    </div>
                  )}
                </div>
                
                {(certificate.metadata.course || certificate.metadata.grade) && (
                  <>
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {certificate.metadata.course && (
                        <div>
                          <div className="flex items-center">
                            <GraduationCap className="h-5 w-5 text-gray-500 mr-2" />
                            <h3 className="text-sm font-medium text-gray-500">Course</h3>
                          </div>
                          <p className="text-gray-900 mt-1">{certificate.metadata.course}</p>
                        </div>
                      )}
                      
                      {certificate.metadata.grade && (
                        <div>
                          <div className="flex items-center">
                            <FileCheck className="h-5 w-5 text-gray-500 mr-2" />
                            <h3 className="text-sm font-medium text-gray-500">Grade</h3>
                          </div>
                          <p className="text-gray-900 mt-1">{certificate.metadata.grade}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {certificate.metadata.institution && (
                  <>
                    <Separator />
                    
                    <div>
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-500 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                      </div>
                      <p className="text-gray-900 mt-1">{certificate.metadata.institution}</p>
                    </div>
                  </>
                )}
                
                {certificate.metadata.additionalInfo && (
                  <>
                    <Separator />
                    
                    <div>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
                      </div>
                      <p className="text-gray-700 mt-1 text-sm">{certificate.metadata.additionalInfo}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate Actions</h3>
            
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                onClick={handleVerify}
                disabled={loading || certificate.status === "verified"}
              >
                <Shield className="mr-2 h-5 w-5" />
                Verify on Blockchain
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleDownload}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Certificate
              </Button>
              
              {isIssuer && certificate.status !== "revoked" && (
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  onClick={handleRevoke}
                  disabled={loading}
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Revoke Certificate
                </Button>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Blockchain Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center">
                  <Hash className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-xs text-gray-500">Certificate ID</span>
                </div>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                  {certificate.id}
                </p>
              </div>
              
              <div>
                <div className="flex items-center">
                  <Hash className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-xs text-gray-500">Blockchain Hash</span>
                </div>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                  {certificate.hash}
                </p>
              </div>
              
              <div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-xs text-gray-500">IPFS CID</span>
                </div>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                  {certificate.ipfsCid}
                </p>
              </div>
              
              <div>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-xs text-gray-500">Issuer Address</span>
                </div>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                  {certificate.issuerAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetail;
