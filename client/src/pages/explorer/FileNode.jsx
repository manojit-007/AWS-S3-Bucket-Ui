import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Download, EyeIcon, FolderOpen, Trash2 } from "lucide-react";
import { getFileIcon } from "@/utils/formatter";
import { Button } from "@/components/ui/button";

const FileNode = ({
  node,
  path = "",
  handleDelete,
  handleFolderDelete,
  handleFileDownload,
  handleView,
}) => {
  const currentPath = path ? `${path}/${node.name}` : node.name;

  if (node.type === "folder") {
    return (
      <Accordion
        type="single"
        collapsible
        className="w-full border border-[#cdcdcd] mt-1 rounded"
      >
        <AccordionItem value={currentPath}>
          <AccordionTrigger className="flex items-center justify-between px-3 py-2  rounded-none hover:bg-gray-100 dark:hover:bg-zinc-700">
            <div className="flex items-center justify-between w-full gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
              <section className="flex gap-2 items-center">
                <FolderOpen className="w-4 h-4 text-[#000000]" />
                {/* 📁 */}
                {node.name}
              </section>
            </div>
            <div
              className="px-3 py-2 bg-transparent rounded-none btn-shadow"
              onClick={(e) => {
                e.stopPropagation();
                {
                    //console.log(currentPath);
                }
                handleFolderDelete(currentPath);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </div>
          </AccordionTrigger>

          <AccordionContent className="mt-0 px-1 pb-1">
            {/* Separate folders and files */}
            {(() => {
              const folders =
                node.children?.filter((child) => child.type === "folder") || [];
              const files =
                node.children?.filter((child) => child.type === "file") || [];

              return (
                <>
                  {folders.length > 0 && (
                    <h1 className="font-bold text-sm mb-1 text-center">
                      Folders
                    </h1>
                  )}
                  {folders.map((child) => (
                    <FileNode
                      key={`${currentPath}/${child.name}-${child.type}`}
                      node={child}
                      path={currentPath}
                      handleView={handleView}
                      handleDelete={handleDelete}
                      handleFileDownload={handleFileDownload}
                      handleFolderDelete={handleFolderDelete}
                    />
                  ))}

                  {files.length > 0 && (
                    <h1 className="font-bold text-sm mt-2 mb-1 text-center">
                      Files
                    </h1>
                  )}
                  {files.map((child) => (
                    <FileNode
                      key={`${currentPath}/${child.name}-${child.type}`}
                      node={child}
                      path={currentPath}
                      handleView={handleView}
                      handleDelete={handleDelete}
                      handleFileDownload={handleFileDownload}
                    />
                  ))}
                </>
              );
            })()}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  // Render file node
  return (
    <div className="flex items-center justify-between px-3 py-2 mt-1 dark:border-zinc-600 rounded-none bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-[#cdcdcd]">
      <div
        className="flex items-center gap-2 truncate cursor-pointer"
        onClick={() => handleView(node.data?.Key)}
      >
        {getFileIcon(node.name)}
        <span className="text-sm text-gray-800 dark:text-gray-100 truncate break-words">
          {node.name}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => handleDelete(node.data?.Key)}
          className="text-xs px-2 py-1  rounded-none transition-colors
        text-black btn-shadow"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => handleFileDownload(node.data?.Key)}
          className="text-xs px-2 py-1  rounded-none transition-colors 
        text-black btn-shadow"
        >
          <Download className="w-4 h-4" />
        </Button>
        
      </div>
    </div>
  );
};

export default FileNode;
