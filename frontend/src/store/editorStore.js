// store/editorStore.js
import { create } from 'zustand';

export const useEditorStore = create((set) => ({
  selectedUid: null,
  uiTree: {}, // key: uid, value: { text, style }

  setUiTree: (newTree) => set({ uiTree: newTree }),

  selectElement: (uid) => set({ selectedUid: uid }),

  deselectElement: () => set({ selectedUid: null }),

  updateStyle: (uid, newStyle) =>
    set((state) => {
      const current = state.uiTree[uid];
      if (!current) return state;
      return {
        uiTree: {
          ...state.uiTree,
          [uid]: {
            ...current,
            style: {
              ...current.style,
              ...newStyle,
            },
          },
        },
      };
    }),

  updateText: (uid, newText) =>
    set((state) => {
      const current = state.uiTree[uid];
      if (!current) return state;
      return {
        uiTree: {
          ...state.uiTree,
          [uid]: {
            ...current,
            text: newText,
          },
        },
      };
    }),
}));
