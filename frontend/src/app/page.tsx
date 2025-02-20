import Image from "next/image";
import TreeView, { TreeNodeType } from "./components/tree-menu";

const treeData: TreeNodeType[] = [
  {
    name: "System Management",
    children: [
      {
        name: "Systems",
        children: [
          {
            name: "System Code",
            children: [
              { name: "Code Registration" },
              { name: "Code Registration - 2" },
            ],
          },
          { name: "Properties" },
          {
            name: "Menus",
            children: [{ name: "Menu Registration" }],
          },
          {
            name: "API List",
            children: [{ name: "API Registration" }, { name: "API Edit" }],
          },
        ],
      },
      {
        name: "Users & Groups",
        children: [
          {
            name: "Users",
            children: [{ name: "User Account Registration" }],
          },
          {
            name: "Groups",
            children: [{ name: "User Group Registration" }],
          },
          {
            name: "사용자 승인",
            children: [{ name: "사용자 승인 상세" }],
          },
        ],
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex space-x-4 items-center">
        <div className="rounded-full bg-arctic-blue w-12 h-12 flex justify-center items-center">
          <Image
            src="/submenu-white.svg"
            alt="Menu Logo"
            width={24}
            height={24}
          />
        </div>
        <h1 className="text-blue-gray font-black text-2xl">Menus</h1>
      </div>
      <div className="flex mt-4">
        <TreeView treeData={treeData} />
      </div>
    </div>
  );
}
