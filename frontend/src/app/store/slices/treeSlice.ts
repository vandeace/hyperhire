import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMenu, IUserSchema } from "../../../../types/menu";

interface TreeState {
  selectedTree: IUserSchema | null;
  treeData: IMenu[];
  tipe: "add" | "edit";
}

const initialState: TreeState = {
  selectedTree: null,
  treeData: [],
  tipe: "add",
};

const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setSelectedTree(state, action: PayloadAction<IUserSchema | null>) {
      state.selectedTree = action.payload;
    },
    setTreeData(state, action: PayloadAction<IMenu[]>) {
      state.treeData = action.payload;
    },
    setTipe(state, action: PayloadAction<"add" | "edit">) {
      state.tipe = action.payload;
    },
  },
});

export const { setSelectedTree, setTreeData, setTipe } = treeSlice.actions;
export default treeSlice.reducer;
