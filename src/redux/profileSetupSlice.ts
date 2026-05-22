import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AgeChoice = "over" | "under" | null;
export type ReligionChoice = "CHRISTIAN" | "BUDDHIST" | "MUSLIM" | "HINDU" | "JEWISH" | "SIKH" | "OTHER" | null;
export type MaritalStatusChoice = "SINGLE" | "MARRIED" | "LONG_TERM_PARTNER" | null;

export interface ProfileSetupState {
  country: string;
  age: AgeChoice;
  religion: ReligionChoice;
  fullName: string;
  nickname: string;
  maritalStatus: MaritalStatusChoice;
}

const initialState: ProfileSetupState = {
  country: "Singapore",
  age: null,
  religion: null,
  fullName: "",
  nickname: "",
  maritalStatus: null,
};

const profileSetupSlice = createSlice({
  name: "profileSetup",
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<string>) {
      state.country = action.payload;
    },
    setAge(state, action: PayloadAction<Exclude<AgeChoice, null>>) {
      state.age = action.payload;
    },
    setReligion(state, action: PayloadAction<Exclude<ReligionChoice, null>>) {
      state.religion = action.payload;
    },
    setFullName(state, action: PayloadAction<string>) {
      state.fullName = action.payload;
    },
    setNickname(state, action: PayloadAction<string>) {
      state.nickname = action.payload;
    },
    setMaritalStatus(state, action: PayloadAction<Exclude<MaritalStatusChoice, null>>) {
      state.maritalStatus = action.payload;
    },
    resetProfileSetup() {
      return initialState;
    },
  },
});

export const {
  setCountry,
  setAge,
  setReligion,
  setFullName,
  setNickname,
  setMaritalStatus,
  resetProfileSetup,
} = profileSetupSlice.actions;

export default profileSetupSlice.reducer;