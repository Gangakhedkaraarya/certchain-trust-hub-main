
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

// Mock IPFS client for demo purposes
class MockIPFSClient {
  async add(file: File): Promise<{ cid: string }> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Generate a fake CID based on file content
        const reader = new FileReader();
        reader.onload = () => {
          const hash = Array.from(new Uint8Array(reader.result as ArrayBuffer))
            .slice(0, 20)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
          resolve({ cid: `Qm${hash}` });
        };
        reader.readAsArrayBuffer(file);
      }, 1500);
    });
  }

  async get(cid: string): Promise<Blob> {
    // In a real app, this would fetch the file from IPFS
    // For demo, we'll just return a fake PDF blob
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyPdfData = new Uint8Array(100).fill(1);
        resolve(new Blob([dummyPdfData], { type: 'application/pdf' }));
      }, 1000);
    });
  }
}

interface IPFSContextType {
  uploadToIPFS: (file: File) => Promise<string>;
  getFromIPFS: (cid: string) => Promise<Blob>;
  isUploading: boolean;
}

const IPFSContext = createContext<IPFSContextType | undefined>(undefined);

export function IPFSProvider({ children }: { children: ReactNode }) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const ipfsClient = new MockIPFSClient();

  const uploadToIPFS = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const result = await ipfsClient.add(file);
      toast.success("File uploaded to IPFS successfully!");
      return result.cid;
    } catch (error: any) {
      console.error("Error uploading to IPFS:", error);
      toast.error(error.message || "Failed to upload file to IPFS");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const getFromIPFS = async (cid: string): Promise<Blob> => {
    try {
      return await ipfsClient.get(cid);
    } catch (error: any) {
      console.error("Error getting from IPFS:", error);
      toast.error(error.message || "Failed to retrieve file from IPFS");
      throw error;
    }
  };

  return (
    <IPFSContext.Provider
      value={{
        uploadToIPFS,
        getFromIPFS,
        isUploading
      }}
    >
      {children}
    </IPFSContext.Provider>
  );
}

export function useIPFS() {
  const context = useContext(IPFSContext);
  if (context === undefined) {
    throw new Error("useIPFS must be used within an IPFSProvider");
  }
  return context;
}
