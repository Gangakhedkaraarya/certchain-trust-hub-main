
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useWeb3 } from "./Web3Context";

export interface Certificate {
  id: string;
  hash: string;
  ipfsCid: string;
  name: string;
  recipientName: string;
  issuerName: string;
  issuerAddress: string;
  issueDate: string;
  expiryDate?: string;
  metadata: {
    title: string;
    description: string;
    course?: string;
    grade?: string;
    institution?: string;
    additionalInfo?: string;
  };
  status: 'verified' | 'pending' | 'revoked' | 'invalid';
}

interface CertificateContextType {
  certificates: Certificate[];
  issuedCertificates: Certificate[];
  getCertificate: (id: string) => Certificate | undefined;
  verifyCertificate: (id: string) => Promise<boolean>;
  issueCertificate: (certificate: Omit<Certificate, "id" | "hash" | "status" | "issuerAddress">) => Promise<Certificate>;
  revokeCertificate: (id: string) => Promise<void>;
  loading: boolean;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export function CertificateProvider({ children }: { children: ReactNode }) {
  const { account } = useWeb3();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load mock certificates on mount
  useEffect(() => {
    const mockCertificates: Certificate[] = [
      {
        id: "cert-001",
        hash: "0x1a2b3c4d5e6f7g8h9i0j",
        ipfsCid: "QmXG8yk8UJjMT6qtE2zSxzz3Y8zNjhzL5eYTgcNUfYYbBa",
        name: "Blockchain Development Certification",
        recipientName: "John Doe",
        issuerName: "Blockchain Academy",
        issuerAddress: "0x123",
        issueDate: "2023-01-15",
        expiryDate: "2026-01-15",
        metadata: {
          title: "Advanced Blockchain Developer",
          description: "Certified proficiency in blockchain development",
          course: "Blockchain Development 401",
          grade: "A",
          institution: "Blockchain Academy"
        },
        status: "verified"
      },
      {
        id: "cert-002",
        hash: "0x9i8u7y6t5r4e3w2q1",
        ipfsCid: "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn",
        name: "Smart Contract Security Certification",
        recipientName: "Jane Smith",
        issuerName: "DeFi Security Institute",
        issuerAddress: "0x456",
        issueDate: "2023-03-20",
        metadata: {
          title: "Smart Contract Security Expert",
          description: "Certified expert in smart contract security and auditing",
          institution: "DeFi Security Institute",
          additionalInfo: "Specialization in EVM-based chains"
        },
        status: "verified"
      },
      {
        id: "cert-003",
        hash: "0xz1x2c3v4b5n6m7",
        ipfsCid: "QmQPeNsJPyVWPFDVHb77w8G42Fvo15z4bG2X8D2GhfbSXc",
        name: "Web3 Application Design Certification",
        recipientName: "Alex Johnson",
        issuerName: "Web3 Design School",
        issuerAddress: "0x789",
        issueDate: "2023-05-10",
        expiryDate: "2025-05-10",
        metadata: {
          title: "Web3 UX Designer",
          description: "Certified skills in Web3 application design and user experience",
          course: "Web3 Design Fundamentals",
          grade: "A-",
          institution: "Web3 Design School"
        },
        status: "pending"
      }
    ];
    
    setCertificates(mockCertificates);
  }, []);

  // Filter certificates issued by the connected account
  const issuedCertificates = certificates.filter(
    cert => cert.issuerAddress === account
  );

  const getCertificate = (id: string): Certificate | undefined => {
    return certificates.find(cert => cert.id === id);
  };

  const verifyCertificate = async (id: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // In a real app, this would verify against the blockchain
      // For demo purposes, we'll simulate verification with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const certificate = certificates.find(cert => cert.id === id);
      
      if (!certificate) {
        toast.error("Certificate not found");
        return false;
      }
      
      if (certificate.status === "revoked") {
        toast.error("This certificate has been revoked");
        return false;
      }
      
      if (certificate.status === "invalid") {
        toast.error("This certificate is invalid");
        return false;
      }
      
      // Update certificate status to verified in our local state
      setCertificates(prev => 
        prev.map(cert => 
          cert.id === id ? { ...cert, status: "verified" as const } : cert
        )
      );
      
      toast.success("Certificate successfully verified on blockchain!");
      return true;
    } catch (error: any) {
      console.error("Error verifying certificate:", error);
      toast.error(error.message || "Failed to verify certificate");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const issueCertificate = async (
    certificateData: Omit<Certificate, "id" | "hash" | "status" | "issuerAddress">
  ): Promise<Certificate> => {
    setLoading(true);
    
    try {
      // In a real app, this would interact with the blockchain and IPFS
      // For demo purposes, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a unique ID and hash for the certificate
      const id = `cert-${Date.now().toString(36)}`;
      const hash = `0x${Array.from({ length: 20 }, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      const newCertificate: Certificate = {
        ...certificateData,
        id,
        hash,
        issuerAddress: account!,
        status: "verified"
      };
      
      setCertificates(prev => [...prev, newCertificate]);
      
      toast.success("Certificate successfully issued and recorded on blockchain!");
      return newCertificate;
    } catch (error: any) {
      console.error("Error issuing certificate:", error);
      toast.error(error.message || "Failed to issue certificate");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const revokeCertificate = async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      // In a real app, this would call the smart contract method
      // For demo purposes, we'll simulate with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const certificate = certificates.find(cert => cert.id === id);
      
      if (!certificate) {
        toast.error("Certificate not found");
        return;
      }
      
      if (certificate.issuerAddress !== account) {
        toast.error("Only the original issuer can revoke this certificate");
        return;
      }
      
      // Update certificate status to revoked in our local state
      setCertificates(prev => 
        prev.map(cert => 
          cert.id === id ? { ...cert, status: "revoked" as const } : cert
        )
      );
      
      toast.success("Certificate successfully revoked on blockchain");
    } catch (error: any) {
      console.error("Error revoking certificate:", error);
      toast.error(error.message || "Failed to revoke certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CertificateContext.Provider
      value={{
        certificates,
        issuedCertificates,
        getCertificate,
        verifyCertificate,
        issueCertificate,
        revokeCertificate,
        loading
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificates() {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error("useCertificates must be used within a CertificateProvider");
  }
  return context;
}
