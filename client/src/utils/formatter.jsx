import {
  FileText,
  ImageIcon,
  FileJson,
  FileCode,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileSignature,
  FileType2, // fallback icon
} from "lucide-react";

// Format bytes to KB, MB, GB
export const formatSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

export const getFileIcon = (key) => {
  const ext = key.split(".").pop().toLowerCase();

  switch (ext) {
    // 🖼️ Images - green
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
      return <ImageIcon className="w-4 h-4 text-black" />;
      // return <ImageIcon className="w-4 h-4 text-blue-500" />;
      
    // 🧠 Code files - blue
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "html":
    case "css":
    case "scss":
    case "py":
    case "java":
    case "c":
    case "cpp":
    case "cs":
    case "php":
    case "rb":
    case "go":
    case "rs":
    case "sh":
      return <FileCode className="w-4 h-4 text-black" />;
      // return <FileCode className="w-4 h-4 text-red-500" />;

    // 📄 JSON - yellow
    case "json":
      return <FileJson className="w-4 h-4 text-black" />;
      // return <FileJson className="w-4 h-4 text-yellow-500" />;

    // 🎬 Videos - red
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
    case "webm":
    case "3gp":
      return <FileVideo className="w-4 h-4 text-black" />;
      // return <FileVideo className="w-4 h-4 text-red-500" />;

    // 🎵 Audio - purple
    case "mp3":
    case "wav":
    case "aac":
    case "flac":
    case "ogg":
      return <FileAudio className="w-4 h-4 text-black" />;
      // return <FileAudio className="w-4 h-4 text-purple-500" />;

    // 🗃️ Archives - orange
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <FileArchive className="w-4 h-4 text-black" />;
      // return <FileArchive className="w-4 h-4 text-orange-500" />;

    // 📊 Spreadsheets - emerald
    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="w-4 h-4 text-black" />;
      // return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;

    // 📃 PDFs - rose
    case "pdf":
      return <FileSignature className="w-4 h-4 text-black" />;
      // return <FileSignature className="w-4 h-4 text-rose-500" />;

    // 📝 Text/markdown - gray
    case "txt":
    case "md":
    case "log":
    case "ini":
    case "yml":
    case "yaml":
      return <FileText className="w-4 h-4 text-gray-500" />;

    // 🔘 Fallback - slate
    default:
      return <FileType2 className="w-4 h-4 text-slate-950" />;
  }
};




// Convert flat S3 list to tree
export function buildFileTree(flatList) {
  const root = [];

  for (const item of flatList) {
    const parts = item.Key.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const existing = current.find((el) => el.name === part);

      if (existing) {
        current = existing.children;
      } else {
        const node = {
          name: part,
          type: i === parts.length - 1 ? "file" : "folder",
          ...(i === parts.length - 1 ? { data: item } : {}),
          ...(i !== parts.length - 1 ? { children: [] } : {}),
        };
        current.push(node);
        //   //console.log(node);
        if (node.type === "folder") {
          current = node.children;
        }
      }
    }
  }

  return root;
}

export const flattenFolderPaths = (tree, prefix = "") => {
  let paths = [];

  for (const node of tree) {
    if (node.type === "folder") {
      const fullPath = `${prefix}${node.name}/`;

      // Create emoji path label: e.g., 🗁test/🗁code/
      const label =
        fullPath
          .split("/")
          .filter(Boolean) // remove empty parts
          .map((part) => `🗁${part}/`)
          .join("");

      paths.push({ label, value: fullPath });

      if (node.children && Array.isArray(node.children)) {
        const childPaths = flattenFolderPaths(node.children, fullPath);
        paths = paths.concat(childPaths);
      }
    }
  }

  return paths;
};
