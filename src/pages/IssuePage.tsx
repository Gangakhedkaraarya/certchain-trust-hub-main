import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3 } from "@/contexts/Web3Context";
import { useCertificates } from "@/contexts/CertificateContext";
import { useIPFS } from "@/contexts/IPFSContext";
import { Award, Calendar, Upload, CheckCircle, AlertTriangle, Loader2, User, FileText, Building, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const issueCertificateSchema = z.object({
  name: z.string().min(3, "Certificate name must be at least 3 characters"),
  recipientName: z.string().min(2, "Recipient name must be at least 2 characters"),
  issuerName: z.string().min(2, "Issuer name must be at least 2 characters"),
  issueDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date format"),
  expiryDate: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  course: z.string().optional(),
  grade: z.string().optional(),
  institution: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type IssueCertificateForm = z.infer<typeof issueCertificateSchema>;

const IssuePage = () => {
  const { account, isIssuer } = useWeb3();
  const { issueCertificate, loading } = useCertificates();
  const { uploadToIPFS, isUploading } = useIPFS();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newCertificateId, setNewCertificateId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<IssueCertificateForm>({
    resolver: zodResolver(issueCertificateSchema),
    defaultValues: {
      issueDate: new Date().toISOString().split('T')[0],
      issuerName: "", // Will be filled based on connected wallet
    }
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const onSubmit = async (data: IssueCertificateForm) => {
    if (!account) {
      toast.error("Please connect your wallet to issue certificates");
      return;
    }
    
    if (!isIssuer) {
      toast.error("Only verified issuers can issue certificates");
      return;
    }
    
    if (!file) {
      toast.error("Please upload a certificate file");
      return;
    }
    
    try {
      const ipfsCid = await uploadToIPFS(file);
      
      const newCertificate = await issueCertificate({
        name: data.name,
        recipientName: data.recipientName,
        issuerName: data.issuerName,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        ipfsCid,
        metadata: {
          title: data.title,
          description: data.description,
          course: data.course,
          grade: data.grade,
          institution: data.institution,
          additionalInfo: data.additionalInfo,
        }
      });
      
      setIsSubmitted(true);
      setNewCertificateId(newCertificate.id);
    } catch (error: any) {
      console.error("Error issuing certificate:", error);
      toast.error(error.message || "Failed to issue certificate");
    }
  };
  
  const handleViewCertificate = () => {
    if (newCertificateId) {
      navigate(`/certificate/${newCertificateId}`);
    }
  };
  
  if (!isIssuer && account) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg border border-red-200 p-6">
          <div className="text-center mb-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">
              Only verified issuers can access this page and issue certificates.
            </p>
          </div>
          <Button onClick={() => navigate("/")} className="w-full">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  if (!account) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center mb-6">
            <Award className="h-12 w-12 text-brand-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Certificates</h2>
            <p className="text-gray-600">
              Connect your wallet to issue blockchain-verified certificates.
            </p>
          </div>
          <Button onClick={() => navigate("/")} className="w-full">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }
  
  if (isSubmitted && newCertificateId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg border border-green-200 overflow-hidden">
          <div className="bg-green-50 px-6 py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Issued Successfully</h2>
            <p className="text-gray-700">
              Your certificate has been successfully issued and recorded on the blockchain.
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-md text-sm">
              <div className="font-medium text-gray-700 mb-1">Certificate ID:</div>
              <div className="font-mono text-gray-900 break-all">{newCertificateId}</div>
            </div>
            
            <Button onClick={handleViewCertificate} className="w-full">
              View Certificate
            </Button>
            
            <Button variant="outline" onClick={() => setIsSubmitted(false)} className="w-full">
              Issue Another Certificate
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Issue New Certificate</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create a new blockchain-verified certificate that will be securely stored on IPFS 
            and recorded on the Ethereum blockchain.
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Information</CardTitle>
                <CardDescription>
                  Basic information about the certificate you're issuing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Certificate Name</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      placeholder="e.g., Blockchain Development Certification"
                      className="pl-10"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Certificate Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Certified Blockchain Developer"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="institution"
                        placeholder="e.g., Blockchain Academy"
                        className="pl-10"
                        {...register("institution")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this certificate represents..."
                    rows={3}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recipient & Issuer</CardTitle>
                <CardDescription>
                  Details about who receives and issues this certificate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient's Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="recipientName"
                        placeholder="e.g., John Doe"
                        className="pl-10"
                        {...register("recipientName")}
                      />
                    </div>
                    {errors.recipientName && (
                      <p className="text-sm text-red-500">{errors.recipientName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issuerName">Issuer's Name</Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="issuerName"
                        placeholder="e.g., Blockchain Academy"
                        className="pl-10"
                        {...register("issuerName")}
                      />
                    </div>
                    {errors.issuerName && (
                      <p className="text-sm text-red-500">{errors.issuerName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="issueDate"
                        type="date"
                        className="pl-10"
                        {...register("issueDate")}
                      />
                    </div>
                    {errors.issueDate && (
                      <p className="text-sm text-red-500">{errors.issueDate.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="expiryDate"
                        type="date"
                        className="pl-10"
                        {...register("expiryDate")}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>
                  Optional information to include in the certificate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course Name (Optional)</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="course"
                        placeholder="e.g., Advanced Blockchain 101"
                        className="pl-10"
                        {...register("course")}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Score (Optional)</Label>
                    <Input
                      id="grade"
                      placeholder="e.g., A or 95%"
                      {...register("grade")}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="institution"
                      placeholder="e.g., Blockchain Academy"
                      className="pl-10"
                      {...register("institution")}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any other details you want to include..."
                    rows={2}
                    {...register("additionalInfo")}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Certificate File</CardTitle>
                <CardDescription>
                  Upload the certificate file that will be stored on IPFS
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                    <FileText className="h-12 w-12 text-gray-400 mb-3" />
                    {file ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <span className="text-xs text-brand-600">
                          Click to change file
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-gray-900">
                          Drop your certificate file here, or{" "}
                          <span className="text-brand-600">browse</span>
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          Supports PDF, JPG, JPEG, PNG (Max 10MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>
                {!file && (
                  <p className="text-sm text-amber-600 mt-2">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    A certificate file is required
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading || isUploading || !file}
                >
                  {loading || isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploading ? "Uploading to IPFS..." : "Issuing Certificate..."}
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Issue Certificate
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssuePage;
