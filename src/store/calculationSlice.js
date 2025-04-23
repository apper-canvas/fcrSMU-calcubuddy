import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCalculations, createCalculation, deleteCalculation } from '../services/apperService';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCalculationsAsync = createAsyncThunk(
  'calculations/fetchCalculations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCalculations();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCalculationAsync = createAsyncThunk(
  'calculations/createCalculation',
  async (calculationData, { rejectWithValue }) => {
    try {
      const response = await createCalculation(calculationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCalculationAsync = createAsyncThunk(
  'calculations/deleteCalculation',
  async (calculationId, { rejectWithValue }) => {
    try {
      await deleteCalculation(calculationId);
      return calculationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const calculationSlice = createSlice({
  name: 'calculations',
  initialState,
  reducers: {
    clearCalculations: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalculationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalculationsAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCalculationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCalculationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCalculationAsync.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items].slice(0, 10);
        state.loading = false;
      })
      .addCase(createCalculationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCalculationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCalculationAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.Id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteCalculationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCalculations } = calculationSlice.actions;

export default calculationSlice.reducer;