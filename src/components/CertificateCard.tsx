
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Certificate } from "@/contexts/CertificateContext";
import { Award, Calendar, User, Shield, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateCardProps {
  certificate: Certificate;
  showActions?: boolean;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  showActions = true
}) => {
  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatusBadge = () => {
    switch (certificate.status) {
      case "verified":
        return (
          <div className="verified-badge">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </div>
        );
      case "pending":
        return (
          <div className="pending-badge">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </div>
        );
      case "revoked":
      case "invalid":
        return (
          <div className="invalid-badge">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {certificate.status === "revoked" ? "Revoked" : "Invalid"}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-brand-500 to-accent-600 text-white">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{certificate.name}</CardTitle>
            <div className="text-xs opacity-80 mt-1">{certificate.metadata.institution || certificate.issuerName}</div>
          </div>
          <StatusBadge />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">Recipient:</span>
            <span className="ml-1 font-medium">{certificate.recipientName}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">Issuer:</span>
            <span className="ml-1 font-medium">{certificate.issuerName}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">Issue Date:</span>
            <span className="ml-1 font-medium">{formattedDate(certificate.issueDate)}</span>
          </div>
          
          {certificate.metadata.course && (
            <div className="text-sm mt-3">
              <span className="text-gray-700">Course:</span>
              <span className="ml-1 font-medium">{certificate.metadata.course}</span>
            </div>
          )}
          
          {certificate.metadata.grade && (
            <div className="text-sm">
              <span className="text-gray-700">Grade:</span>
              <span className="ml-1 font-medium">{certificate.metadata.grade}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between">
          <div className="text-xs text-gray-500 truncate max-w-[180px]">
            ID: {certificate.id}
          </div>
          <Link to={`/certificate/${certificate.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default CertificateCard;
