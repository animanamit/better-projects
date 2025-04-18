import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  isMobileMenuOpen: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  darkMode: false,
  isMobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  toggleDarkMode,
  setDarkMode,
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;