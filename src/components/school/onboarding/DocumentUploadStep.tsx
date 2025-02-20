"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@clerk/nextjs";
import { Loader2, Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const REQUIRED_DOCUMENTS = [
  {
    type: "license",
    name: "School License",
    description: "Valid school operating license",
    required: true,
  },
  {
    type: "registration",
    name: "Registration Certificate",
    description: "School registration certificate",
    required: true,
  },
  {
    type: "accreditation",
    name: "Accreditation Certificate",
    description: "School accreditation certificate",
    required: false,
  },
  {
    type: "tax",
    name: "Tax Registration",
    description: "Tax registration document",
    required: true,
  },
  {
    type: "safety",
    name: "Safety Certificate",
    description: "Building safety certificate",
    required: true,
  },
  {
    type: "insurance",
    name: "Insurance Document",
    description: "School insurance policy",
    required: true,
  },
];

interface DocumentUploadStepProps {
  schoolId: string;
  onComplete: () => void;
}

export default function DocumentUploadStep({ schoolId, onComplete }: DocumentUploadStepProps) {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: any }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [validUntil, setValidUntil] = useState<{ [key: string]: string }>({});
  
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const { user } = useUser();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading((prev) => ({ ...prev, [docType]: true }));

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${schoolId}/${docType}-${Date.now()}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("school-documents")
        .upload(fileName, file);

      if (storageError) throw storageError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("school-documents")
        .getPublicUrl(fileName);

      // Save document record in database
      const { data: docData, error: docError } = await supabase
        .from("school_documents")
        .insert({
          school_id: schoolId,
          type: docType,
          name: REQUIRED_DOCUMENTS.find((d) => d.type === docType)?.name || file.name,
          url: publicUrlData.publicUrl,
          status: "pending",
          notes: notes[docType] || "",
          uploaded_by: user?.id,
          valid_until: validUntil[docType] || null,
        })
        .select()
        .single();

      if (docError) throw docError;

      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: docData,
      }));

      toast({
        title: "Document uploaded",
        description: "Document has been uploaded successfully and is pending review.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading((prev) => ({ ...prev, [docType]: false }));
    }
  };

  const removeDocument = async (docType: string) => {
    const doc = uploadedDocs[docType];
    if (!doc) return;

    try {
      // Delete from storage
      const fileName = doc.url.split("/").pop();
      await supabase.storage.from("school-documents").remove([`${schoolId}/${fileName}`]);

      // Delete from database
      await supabase.from("school_documents").delete().eq("id", doc.id);

      setUploadedDocs((prev) => {
        const newDocs = { ...prev };
        delete newDocs[docType];
        return newDocs;
      });

      toast({
        title: "Document removed",
        description: "Document has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Removal failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    const requiredDocs = REQUIRED_DOCUMENTS.filter((doc) => doc.required);
    const uploadedRequired = requiredDocs.every(
      (doc) => uploadedDocs[doc.type]
    );

    if (!uploadedRequired) {
      toast({
        title: "Missing documents",
        description: "Please upload all required documents before proceeding.",
        variant: "destructive",
      });
      return;
    }

    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">School Documents</h2>
        <p className="text-muted-foreground">
          Upload all required documents for your school
        </p>
      </div>

      <div className="grid gap-6">
        {REQUIRED_DOCUMENTS.map((doc) => (
          <Card key={doc.type} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {doc.name}
                    {doc.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {doc.description}
                  </p>
                </div>
                {uploadedDocs[doc.type] && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument(doc.type)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {!uploadedDocs[doc.type] ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`notes-${doc.type}`}>Notes</Label>
                    <Textarea
                      id={`notes-${doc.type}`}
                      placeholder="Add any relevant notes about this document"
                      value={notes[doc.type] || ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [doc.type]: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`valid-until-${doc.type}`}>
                      Valid Until
                    </Label>
                    <Input
                      id={`valid-until-${doc.type}`}
                      type="date"
                      value={validUntil[doc.type] || ""}
                      onChange={(e) =>
                        setValidUntil((prev) => ({
                          ...prev,
                          [doc.type]: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, doc.type)}
                      disabled={uploading[doc.type]}
                    />
                    <Button disabled={uploading[doc.type]}>
                      {uploading[doc.type] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  ✓ Document uploaded - Pending review
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleComplete}>
          Complete Document Upload
        </Button>
      </div>
    </div>
  );
} 