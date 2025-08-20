import React, { useRef, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { getAllS3BucketContent, getUrlToUpload } from "@/redux/data/dataThunkFn";
import axios from "axios";
import { flattenFolderPaths } from "@/utils/formatter";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const UploaderForm = ({ data }) => {
  const dispatch = useDispatch();
  const [fileType, setFileType] = useState("single");
  const [files, setFiles] = useState([]);
  const [customPath, setCustomPath] = useState("");
  const [selectedPath, setSelectedPath] = useState("Root/");
  const [loading, setLoading] = useState(false);
  const { urlToUpload } = useSelector((state) => state.s3Bucket);
  const fileInputRef = useRef(null);

  const actualPath = useMemo(
    () => (selectedPath === "Root/" ? "" : selectedPath),
    [selectedPath]
  );

  const handleChange = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    if (selectedFiles.length === 0) return;

    const fileMeta = selectedFiles.map((file) => ({
      fileName: `${actualPath}${file.name}`,
      contentType: file.type || "application/octet-stream",
    }));

    try {
      await dispatch(getUrlToUpload(fileMeta)).unwrap();
    } catch (err) {
      toast.error(`   ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!urlToUpload || urlToUpload.length === 0) {
        toast.error("   No upload URLs available. Please try again.");
        return;
      }
  
      await Promise.all(
        urlToUpload.map(({ fileName, url }) => {
          const shortFileName = fileName.split("/").pop();
          const file = files.find((f) => f.name === shortFileName);
          if (!file) return null;
  
          return axios.put(url, file, {
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          });
        })
      );
  
      toast.success("  All files uploaded successfully!");
      setFiles([]);
      setCustomPath("");
      setSelectedPath("Root/");
      dispatch(getAllS3BucketContent());
  
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("   Upload failed:", err.response?.data || err.message);
      toast.error("   Upload failed.");
    } finally {
      setLoading(false);
    }
  };
  

  const folderPaths = useMemo(() => flattenFolderPaths(data || []), [data]);

  return (
    <Dialog title="Upload anything">
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-none border btn-shadow text-black"
        >
          <Upload className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload to S3</DialogTitle>
          <DialogDescription>
            Select files and destination path to upload to your AWS S3 bucket.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Folder Selection */}
          <section>
            <Label className="text-sm font-medium">Destination Folder</Label>
            <Select
              onValueChange={(val) => {
                setCustomPath("");
                setSelectedPath(val);
              }}
              defaultValue="Root/"
            >
              <SelectTrigger className="w-full border rounded-none">
                <SelectValue placeholder="Root" />
              </SelectTrigger>
              <SelectContent>
                {folderPaths && folderPaths.length > 0 ? (
                  <SelectGroup>
                    {folderPaths.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    No folders available
                  </div>
                )}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Or type a custom folder (e.g., test/)"
              value={
                customPath || (selectedPath === "Root/" ? "" : selectedPath)
              }
              onChange={(e) => {
                const val = e.target.value;
                setCustomPath(val);

                // Only add "/" if it's not empty and doesn't already end with "/"
                const finalPath = val && !val.endsWith("/") ? val + "/" : val;
                setSelectedPath(finalPath);
              }}
              onBlur={() => {
                // Append "/" only if not empty and doesn't already have it
                if (customPath && !customPath.endsWith("/")) {
                  const final = customPath + "/";
                  setCustomPath(final);
                  setSelectedPath(final);
                }
              }}
              className="w-full border rounded-none mt-2"
            />
          </section>

          {/* File Type Radio */}
          <section className="flex items-center gap-4">
            <div className="flex items-center">
              <Input
                type="radio"
                name="fileType"
                value="single"
                id="single"
                checked={fileType === "single"}
                onChange={() => setFileType("single")}
                className="border border-black rounded-none"
              />
              <Label htmlFor="single" className="ml-2">
                Single
              </Label>
            </div>
            <div className="flex items-center">
              <Input
                type="radio"
                name="fileType"
                value="multiple"
                id="multiple"
                checked={fileType === "multiple"}
                onChange={() => setFileType("multiple")}
                className="border border-black rounded-none"
              />
              <Label htmlFor="multiple" className="ml-2">
                Multiple
              </Label>
            </div>
          </section>

          {/* File Input */}
          <Input
            type="file"
            multiple={fileType === "multiple"}
            onChange={handleChange}
            ref={fileInputRef}
            className="border rounded-none"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || files.length === 0}
            className="w-full btn-shadow rounded-none border bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>

          {/* File List */}
          {files.length > 0 && (
            <p className="mt-2 text-sm text-gray-700">
              Selected: {files.map((f) => f.name).join(", ")}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploaderForm;
