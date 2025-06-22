import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/UserType';
import type { LoginForm } from '../../types/FormType';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { tokenManager } from '../../services/tokenManager';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean; // Para saber si ya verificamos el estado inicial
}

// Inicializar estado usando tokenManager - con validación adicional
const getInitialState = (): AuthState => {
  const token = tokenManager.getToken();
  const user = tokenManager.getUser();
  const isAuthenticated = !!(token && user);

  console.log('🔍 Redux Initial State:', {
    token: !!token,
    user: !!user,
    isAuthenticated,
  });

  return {
    user,
    token,
    isAuthenticated,
    loading: false,
    error: null,
    initialized: false,
  };
};

const initialState: AuthState = getInitialState();

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginForm, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux login thunk started');
      const response = await authService.login(credentials);
      console.log('✅ Redux login thunk success:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Redux login thunk error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  return null;
});

// Thunk para inicializar el estado de autenticación al cargar la app
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  try {
    if (authService.isAuthenticated()) {
      const user = await authService.getCurrentUser();
      return user;
    }
    return null;
  } catch (error: any) {
    // Si falla, limpiar tokens
    await authService.logout();
    return null;
  }
});

// Thunk para registro de usuarios (admin only)
export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      roleId: number;
      department?: string;
      position?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await authService.register(userData);
      return { message: 'User registered successfully' };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      console.log('🔄 Redux setCredentials:', action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;

      tokenManager.setToken(action.payload.token);
      tokenManager.setUser(action.payload.user);
    },
    // Acción para limpiar el estado completo
    resetAuth: (state) => {
      console.log('🗑️ Redux resetAuth');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.initialized = false;

      tokenManager.clear();
    },
    // Marcar como inicializado
    setInitialized: (state) => {
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;

          tokenManager.setUser(action.payload);
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;

        tokenManager.clear();
      })
      // Login cases
      .addCase(login.pending, (state) => {
        console.log('🔄 Redux login pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('✅ Redux login fulfilled:', action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.initialized = true;

        tokenManager.setToken(action.payload.token);
        tokenManager.setUser(action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        console.log('❌ Redux login rejected:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;

        tokenManager.clear();
      })
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;

        tokenManager.setUser(action.payload);
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;

        tokenManager.clear();
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        console.log('✅ Redux logout fulfilled');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;

        tokenManager.clear();
      })
      // Register user cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCredentials, resetAuth, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
