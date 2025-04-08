
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { Shield, Search, Award, LockKeyhole, Database, FileCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { account, isIssuer, connectWallet } = useWeb3();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-600 to-accent-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Secure, Verifiable Certificates on the Blockchain
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                CertChain revolutionizes credential verification with tamper-proof digital certificates 
                secured by blockchain technology and IPFS decentralized storage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {account ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-white text-brand-700 hover:bg-gray-100"
                      onClick={() => navigate("/verify")}
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Verify Certificate
                    </Button>
                    {isIssuer && (
                      <Button 
                        variant="outline"
                        size="lg" 
                        className="border-white text-black hover:bg-white/10"
                        onClick={() => navigate("/issue")}
                      >
                        <Award className="mr-2 h-5 w-5" />
                        Issue Certificate
                      </Button>
                    )}
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    className="bg-white text-brand-700 hover:bg-gray-100"
                    onClick={connectWallet}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Connect with MetaMask
                  </Button>
                )}
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl">
                <div className="bg-white/5 border border-white/10 rounded-lg p-8 relative">
                  <div className="absolute -top-3 -right-3 bg-accent-500 text-white text-xs py-1 px-3 rounded-full">
                    Verified
                  </div>
                  <div className="flex justify-center mb-6">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-1">Blockchain Certificate</h3>
                    <p className="text-white/80 mb-4">Issued by CertChain Academy</p>
                    <div className="mb-4 text-sm">
                      <p>Awarded to: <span className="font-semibold">Dhruv Aarya Gangakhedkar</span></p>
                      <p>Issue Date: <span className="font-semibold">April 8, 2025</span></p>
                    </div>
                    <div className="text-xs text-white/70 font-mono p-2 bg-black/20 rounded-md">
                      0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use CertChain?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform leverages blockchain technology to create a secure, transparent, and efficient 
              certificate verification system for educational institutions and organizations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-brand-100 p-3 rounded-full w-fit mb-5">
                <LockKeyhole className="h-6 w-6 text-brand-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Tamper-Proof Security</h3>
              <p className="text-gray-600">
                Certificates stored on the blockchain cannot be altered or forged, ensuring complete authenticity and trust.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-brand-100 p-3 rounded-full w-fit mb-5">
                <Search className="h-6 w-6 text-brand-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Instant Verification</h3>
              <p className="text-gray-600">
                Verify any certificate in seconds using our blockchain verification system, eliminating lengthy manual processes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-brand-100 p-3 rounded-full w-fit mb-5">
                <Database className="h-6 w-6 text-brand-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Decentralized Storage</h3>
              <p className="text-gray-600">
                Certificates are stored on IPFS, ensuring they remain accessible even if the issuing organization ceases to exist.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-accent-100 p-3 rounded-full w-fit mb-5">
                <Shield className="h-6 w-6 text-accent-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Verified Issuers</h3>
              <p className="text-gray-600">
                Only approved institutions can issue certificates, maintaining the integrity and value of the ecosystem.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-accent-100 p-3 rounded-full w-fit mb-5">
                <FileCheck className="h-6 w-6 text-accent-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Revocation Support</h3>
              <p className="text-gray-600">
                Institutions can revoke certificates if necessary, providing a complete lifecycle management system.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-accent-100 p-3 rounded-full w-fit mb-5">
                <Award className="h-6 w-6 text-accent-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Global Recognition</h3>
              <p className="text-gray-600">
                Blockchain certificates can be verified anywhere in the world, eliminating geographical barriers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-50 to-accent-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Ready to Eliminate Certificate Fraud?
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Whether you're an educational institution looking to issue secure certificates or an employer 
                  wanting to verify credentials, CertChain provides the tools you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/verify")}
                  >
                    Verify a Certificate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate("/certificates")}
                  >
                    Browse Certificates
                  </Button>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-brand-50 to-accent-50 p-6 border border-gray-200">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="bg-brand-100 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Institutions Secured</h3>
                    <p className="text-xl font-bold text-brand-600">150+</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="bg-brand-100 p-2 rounded-full">
                    <Award className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Certificates Issued</h3>
                    <p className="text-xl font-bold text-brand-600">10,000+</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-accent-100 p-2 rounded-full">
                    <Search className="h-5 w-5 text-accent-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Verifications Performed</h3>
                    <p className="text-xl font-bold text-accent-600">25,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
