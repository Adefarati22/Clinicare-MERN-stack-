import { useState } from "react";

// for single file upload
export function useFile() {
  const [selectedFile, setSelectedFile] = useState("");
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("File with maximum size of 5MB is allowed");
      return false;
    }
    const validFile = file?.type.startsWith("image/") ;//if you don't want to specify a type then just remove the if statement
    if (!validFile) {
      setError("Please upload only image file");
      return false;
    }
    //covert image //to base64 url string
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onerror = () => {
        setError("Error reading file");
      };
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
    }
  };
  return { selectedFile, setSelectedFile, error, handleFile, setError };
}


// for multiple file upload
export function useFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [err, setErr] = useState(null);

  const handleImage = (e) => {
    const files = e.target.files;
    if (files) {
      const fileArray = [...Array.from(files ?? [])];
      const errors = [];
      if (fileArray.length > 10) {
        errors.push("You can only upload up to 10 media files");
        return;
      }
      const validFiles = fileArray.filter((file) => {
        if (
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/")
        ) {
          errors.push("Please upload only image or video files");
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          errors.push("File size should be less than 10MB");
          return false;
        }
        return true;
      });
      if (errors.length > 0) {
        setErr(errors.join(", "));
        return;
      }
      setSelectedFiles([]);
      setErr(null);
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFiles((prev) => [
            ...prev,
            { file, preview: reader.result },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  return { selectedFiles, setSelectedFiles, err, setErr, handleImage };
}