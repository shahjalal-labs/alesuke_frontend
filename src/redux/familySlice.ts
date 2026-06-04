// redux/slices/familySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define possible marital status values
type MaritalStatus = 'single' | 'married' | 'relationship' | null;

// Define the shape of the family state
interface FamilyState {
  maritalStatus: MaritalStatus;
  spouse: any[];   // Replace `any` with a proper Member type if available
  partner: any[];  // Replace `any` with a proper Member type if available
}

const initialState: FamilyState = {
  maritalStatus: null,
  spouse: [],
  partner: [],
};

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    setMaritalData(
      state,
      action: PayloadAction<{ maritalStatus: Exclude<MaritalStatus, null>; data: any[] }>
    ) {
      state.maritalStatus = action.payload.maritalStatus;
      if (action.payload.maritalStatus === 'married') {
        state.spouse = action.payload.data;
        state.partner = []; // Optionally clear partner data when switching to married
      } else if (action.payload.maritalStatus === 'relationship') {
        state.partner = action.payload.data;
        state.spouse = []; // Optionally clear spouse data
      } else if (action.payload.maritalStatus === 'single') {
        // Clear both arrays for single
        state.spouse = [];
        state.partner = [];
      }
    },
    // Optional: add a reset action
    resetFamilyData(state) {
      state.maritalStatus = null;
      state.spouse = [];
      state.partner = [];
    },
  },
});

export const { setMaritalData, resetFamilyData } = familySlice.actions;
export default familySlice.reducer;