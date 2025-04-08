
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { Loader2, Shield, ShieldCheck } from "lucide-react";

const Header = () => {
  const { account, isIssuer, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  const location = useLocation();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link to="/" className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-brand-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">CertChain</span>
          </Link>
          
          <nav className="ml-8 hidden md:flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/")
                  ? "text-brand-700 bg-brand-50"
                  : "text-gray-700 hover:text-brand-700 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/verify"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/verify")
                  ? "text-brand-700 bg-brand-50"
                  : "text-gray-700 hover:text-brand-700 hover:bg-gray-50"
              }`}
            >
              Verify
            </Link>
            <Link
              to="/certificates"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/certificates")
                  ? "text-brand-700 bg-brand-50"
                  : "text-gray-700 hover:text-brand-700 hover:bg-gray-50"
              }`}
            >
              Certificates
            </Link>
            {isIssuer && (
              <Link
                to="/issue"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/issue")
                    ? "text-brand-700 bg-brand-50"
                    : "text-gray-700 hover:text-brand-700 hover:bg-gray-50"
                }`}
              >
                Issue
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isIssuer && (
            <div className="hidden sm:flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              <Shield className="h-3.5 w-3.5 mr-1" />
              Verified Issuer
            </div>
          )}
          
          {account ? (
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium hidden sm:block">
                {shortenAddress(account)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connectWallet} 
              size="sm"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="mt-4 sm:hidden flex justify-center">
        <nav className="flex space-x-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/")
                ? "text-brand-700 bg-brand-50"
                : "text-gray-700 hover:text-brand-700 hover:bg-gray-50"
            }`}
          >
            Home
          </Link>
          <Link
            to="/verify"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/verify")
                ? "text-brand-700 bg-brand-50"
                : "text-gray-700 hover:text-brand-700 hover:bg-gray-50"
            }`}
          >
            Verify
          </Link>
          <Link
            to="/certificates"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/certificates")
                ? "text-brand-700 bg-brand-50"
                : "text-gray-700 hover:text-brand-700 hover:bg-gray-50"
            }`}
          >
            List
          </Link>
          {isIssuer && (
            <Link
              to="/issue"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/issue")
                  ? "text-brand-700 bg-brand-50"
                  : "text-gray-700 hover:text-brand-700 hover:bg-gray-50"
              }`}
            >
              Issue
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
