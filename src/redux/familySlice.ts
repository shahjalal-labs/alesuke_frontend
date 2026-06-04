// redux/slices/familySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define possible marital status values
type MaritalStatus = 'single' | 'married' | 'relationship' | null;

// Define the shape of the family state
interface FamilyState {
  maritalStatus: MaritalStatus;
  spouse: any[];   // Replace `any` with a proper Member type if available
  partner: any[];  // Replace `any` with a proper Member type if available
  haveChildren: boolean | null;
  havePets: boolean | null; // ✅ Added
}

const initialState: FamilyState = {
  maritalStatus: null,
  spouse: [],
  partner: [],
  haveChildren: null,
  havePets: null, // ✅ Initialized
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
        state.partner = [];
      } else if (action.payload.maritalStatus === 'relationship') {
        state.partner = action.payload.data;
        state.spouse = [];
      } else if (action.payload.maritalStatus === 'single') {
        state.spouse = [];
        state.partner = [];
      }
    },
    setHaveChildren(state, action: PayloadAction<boolean>) {
      state.haveChildren = action.payload;
    },
    setHavePets(state, action: PayloadAction<boolean>) {
      state.havePets = action.payload;
    },
    resetFamilyData(state) {
      state.maritalStatus = null;
      state.spouse = [];
      state.partner = [];
      state.haveChildren = null;
      state.havePets = null; // ✅ Reset
    },
  },
});

export const { setMaritalData, setHaveChildren, setHavePets, resetFamilyData } = familySlice.actions;
export default familySlice.reducer;