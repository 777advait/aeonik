"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import { inngest } from "~/inngest/client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import { uploadConnection } from "~/inngest/upload-connection";

interface CSVUploadComponentProps {
  onUpload?: (file: File) => Promise<void>;
  className?: string;
}

type UploadState = "idle" | "dragover" | "uploading" | "success" | "error";

interface FileData {
  file: File;
  name: string;
  size: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.type !== "text/csv" && !file.name.toLowerCase().endsWith(".csv")) {
    return { valid: false, error: "Please select a CSV file only" };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: "File size must be less than 10MB" };
  }

  return { valid: true };
};

export const CSVUploadComponent = ({
  onUpload,
  className = "",
}: CSVUploadComponentProps) => {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const api = useTRPC();
  const { data: user, error: userError } = useQuery(api.auth.me.queryOptions());

  if (!user || userError) return null;

  const resetState = useCallback(() => {
    setState("idle");
    setProgress(0);
    setFileData(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const simulateUpload = useCallback(
    async (file: File) => {
      setState("uploading");
      setProgress(0);

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setProgress(i);
      }

      // Simulate potential upload error (10% chance)
      if (Math.random() < 0.1) {
        setState("error");
        setError("Upload failed. Please try again.");
        return;
      }

      if (onUpload) {
        try {
          await onUpload(file);
        } catch (err) {
          setState("error");
          setError(err instanceof Error ? err.message : "Upload failed");
          return;
        }
      }

      setState("success");
    },
    [onUpload],
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      setState("uploading");
      setProgress(0);
      setError("");

      let rows: {
        "First Name": string;
        "Last Name": string;
        URL: string;
        "Email Address": string;
        Company: string;
        Position: string;
        "Connected On": string;
      }[] = [];

      Papa.parse<{
        "First Name": string;
        "Last Name": string;
        URL: string;
        "Email Address": string;
        Company: string;
        Position: string;
        "Connected On": string;
      }>(file, {
        header: true,
        skipEmptyLines: true,
        step: (row) => rows.push(row.data),
        complete: async () => {
          const totalRows = rows.length;
          let processed = 0;

          for (const row of rows) {
            const requiredFields = [
              row["First Name"],
              row["Last Name"],
              row.Company,
              row["Connected On"],
              row.URL,
              row.Position,
            ];

            if (requiredFields.some((f) => !f || f.trim?.() === "")) {
              continue;
            }

            try {
              await uploadConnection({
                firstName: row["First Name"],
                lastName: row["Last Name"],
                url: row.URL,
                company: row.Company,
                position: row.Position,
                connectedOn: row["Connected On"],
                userID: user.id,
              });
            } catch (err) {
              console.error("Error sending row:", err);
              setState("error");
              setError("Error while processing rows");
              return;
            }

            processed++;
            setProgress(Math.round((processed / totalRows) * 100));
          }

          setState("success");
        },
      });
    },
    [user.id],
  );

  // const handleFileSelect = useCallback(
  //   async (file: File) => {
  //     // Validate file
  //     const validation = validateFile(file);
  //     if (!validation.valid) {
  //       setState("error");
  //       setError(validation.error || "Invalid file");
  //       return;
  //     }

  //     // Prepare file info
  //     const fileInfo: FileData = {
  //       file,
  //       name: file.name,
  //       size: formatFileSize(file.size),
  //     };

  //     setFileData(fileInfo);
  //     setError("");

  //     // Parse CSV
  //     Papa.parse<TInsertConnections>(file, {
  //       header: true, // set false if you don’t want first row as keys
  //       skipEmptyLines: true,
  //       complete: async (results) => {
  //         console.log(results);
  //       },
  //     });

  //     // Simulate upload progress
  //     await simulateUpload(file);
  //   },
  //   [simulateUpload],
  // );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (state === "idle") {
        setState("dragover");
      }
    },
    [state],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (state === "dragover") {
        setState("idle");
      }
    },
    [state],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setState("idle");

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]!);
      }
    },
    [handleFileSelect],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]!);
      }
    },
    [handleFileSelect],
  );

  const handleClick = useCallback(() => {
    if (state === "idle" || state === "error") {
      fileInputRef.current?.click();
    }
  }, [state]);

  const getDropzoneStyles = () => {
    const baseStyles =
      "relative flex flex-col items-center justify-center w-full min-h-[300px] px-6 py-8 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer bg-card hover:bg-muted/50";

    switch (state) {
      case "dragover":
        return `${baseStyles} border-primary bg-primary/5 scale-[1.02]`;
      case "success":
        return `${baseStyles} border-green-500 bg-green-500/5`;
      case "error":
        return `${baseStyles} border-destructive bg-destructive/5`;
      default:
        return `${baseStyles} border-border hover:border-muted-foreground`;
    }
  };

  return (
    <div className={`mx-auto w-full max-w-2xl space-y-4 ${className}`}>
      <motion.div
        className={getDropzoneStyles()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: state === "idle" || state === "error" ? 1.01 : 1 }}
        whileTap={{ scale: state === "idle" || state === "error" ? 0.99 : 1 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Select CSV file"
        />

        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-primary/10 mb-4 rounded-full p-4">
                <Upload className="text-primary h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Upload CSV File</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
              <div className="text-muted-foreground text-sm">
                <p>Supported format: .csv</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </motion.div>
          )}

          {state === "dragover" && (
            <motion.div
              key="dragover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-primary/20 mb-4 rounded-full p-4">
                <Upload className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-primary mb-2 text-xl font-semibold">
                Drop your file here
              </h3>
              <p className="text-primary/80">Release to upload your CSV file</p>
            </motion.div>
          )}

          {state === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full max-w-sm flex-col items-center text-center"
            >
              <div className="bg-primary/10 mb-4 rounded-full p-4">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Uploading...</h3>
              {fileData && (
                <div className="text-muted-foreground mb-4 text-sm">
                  <p className="text-foreground font-medium">{fileData.name}</p>
                  <p>{fileData.size}</p>
                </div>
              )}
              <div className="bg-muted mb-2 h-2 w-full rounded-full">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-muted-foreground text-sm">
                {progress}% complete
              </p>
            </motion.div>
          )}

          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-green-500/10 p-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-green-500">
                Upload Successful!
              </h3>
              {fileData && (
                <div className="text-muted-foreground mb-4 text-sm">
                  <p className="text-foreground font-medium">{fileData.name}</p>
                  <p>{fileData.size}</p>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetState();
                }}
                className="text-primary hover:text-primary/80 px-4 py-2 text-sm font-medium transition-colors"
              >
                Upload Another File
              </button>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-destructive/10 mb-4 rounded-full p-4">
                <AlertCircle className="text-destructive h-8 w-8" />
              </div>
              <h3 className="text-destructive mb-2 text-xl font-semibold">
                Upload Failed
              </h3>
              <p className="text-destructive/80 mb-4">{error}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetState();
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close button for success/error states */}
        {(state === "success" || state === "error") && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              resetState();
            }}
            className="hover:bg-muted absolute top-4 right-4 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </motion.div>

      {/* File preview outside of dropzone for better UX */}
      <AnimatePresence>
        {fileData && (state === "uploading" || state === "success") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border-border mt-4 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-muted rounded p-2">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{fileData.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {fileData.size}
                  </p>
                </div>
              </div>
              {state === "uploading" && (
                <div className="flex items-center space-x-2">
                  <Loader2 className="text-primary h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground text-sm">
                    {progress}%
                  </span>
                </div>
              )}
              {state === "success" && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-muted-foreground text-center text-sm">
        Don't know how to get connections csv? Click{" "}
        <a
          className="underline underline-offset-2"
          href="https://www.linkedin.com/mypreferences/d/download-my-data"
        >
          here
        </a>
      </p>
    </div>
  );
};

export default CSVUploadComponent;
