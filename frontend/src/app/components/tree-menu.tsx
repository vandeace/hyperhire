"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

export interface TreeNodeType {
  name: string;
  children?: TreeNodeType[];
}

const TreeNode: React.FC<{
  node: TreeNodeType;
  expandedNodes: Set<string>;
  toggleNode: (name: string) => void;
}> = ({ node, expandedNodes, toggleNode }) => {
  const isExpanded = expandedNodes.has(node.name);
  const [isHovered, setIsHovered] = useState(false);
  const isLastChild = !node.children;
  return (
    <div className="ml-4">
      <div
        className="flex items-center space-x-2 w-max"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          onClick={() => toggleNode(node.name)}
          className="text-left  flex items-center space-x-2 focus:outline-none h-8"
        >
          {node.children && (
            <span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
          <span>{node.name}</span>
        </div>
        {isHovered && (
          <span className="flex space-x-1">
            <Button
              variant="ghost"
              size="smallIcon"
              className="hover:bg-arctic-blue bg-arctic-blue rounded-full"
            >
              <Plus color="white" />
            </Button>
            {isLastChild && (
              <Button
                variant="ghost"
                size="smallIcon"
                className="hover:bg-red-600 bg-red-500 rounded-full"
              >
                <Trash className="w-2 h-2" color="white" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="smallIcon"
              className="hover:bg-arctic-blue bg-arctic-blue rounded-full"
            >
              <Edit color="white" />
            </Button>
          </span>
        )}
      </div>
      {isExpanded && node.children && (
        <div className="ml-6 border-l pl-2">
          {node.children.map((child) => (
            <TreeNode
              key={child.name}
              node={child}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView: React.FC<{ treeData: TreeNodeType[] }> = ({ treeData }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const toggleNode = (name: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allNodeNames = new Set<string>();
    const collectNames = (nodes: TreeNodeType[]) => {
      nodes.forEach((node) => {
        allNodeNames.add(node.name);
        if (node.children) collectNames(node.children);
      });
    };
    collectNames(treeData);
    setExpandedNodes(allNodeNames);
  };

  const collapseAll = () => setExpandedNodes(new Set());

  useEffect(() => {
    expandAll();
  }, []);

  return (
    <div className="rounded-lg w-96">
      {/* Expand/Collapse Buttons */}
      <div className="mb-2 flex space-x-2">
        <button
          onClick={expandAll}
          className="px-6 py-2 bg-blue-gray rounded-3xl text-white"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-6 py-2 bg-white border border-blue-gray rounded-3xl text-blue-gray"
        >
          Collapse All
        </button>
      </div>

      {treeData.map((node) => (
        <TreeNode
          key={node.name}
          node={node}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
        />
      ))}
    </div>
  );
};

export default TreeView;
