import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  assistantOpen: boolean;
}

const initialState: UIState = {
  assistantOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAssistant(state) {
      state.assistantOpen = true;
    },
    closeAssistant(state) {
      state.assistantOpen = false;
    },
    toggleAssistant(state) {
      state.assistantOpen = !state.assistantOpen;
    },
    setAssistantOpen(state, action: PayloadAction<boolean>) {
      state.assistantOpen = action.payload;
    },
  },
});

export const {
  openAssistant,
  closeAssistant,
  toggleAssistant,
  setAssistantOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
