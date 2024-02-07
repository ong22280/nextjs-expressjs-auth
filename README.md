# Redux Toolkit Authentication

<!-- Manage Your React (TypeScript) Application State Using Redux Toolkit
Prabhashi Meddegoda
Stackademic

Published in
Stackademic
3 -->

<!-- add reference -->
reference: Prabhashi Meddegoda. "Manage Your React (TypeScript) Application State Using Redux Toolkit." Stackademic, 2021. [medium](https://medium.com/stackademic/manage-your-react-typescript-application-state-using-redux-toolkit-926d3b4abaa7)

1.  **Redux Setup:** Redux Toolkit providing a configureStore() function that encapsulates various configurations setup.

    ```javascript
    import { configureStore } from "@reduxjs/toolkit";
    import authReducer from "./slices/authSlice";
    import notificationReducer from "./slices/notificationSlice";

    export const makeStore = () =>
      configureStore({
        reducer: {
          auth: authReducer,
          notification: notificationReducer,
        },
      });

    // Infer the type of makeStore
    export type AppStore = ReturnType<typeof makeStore>;
    // Infer the `RootState` and `AppDispatch` types from the store itself
    export type RootState = ReturnType<AppStore["getState"]>;
    export type AppDispatch = AppStore["dispatch"];
    ```
    - The `configureStore` function takes an object with a reducer property, which is an object containing all the reducers used in the application. Each reducer is associated with a slice of the application state. 
    - type `AppStore` that represents the return type of the makeStore function. ReturnType`<typeof makeStore>` is a TypeScript utility type that infers the return type of a function.
    - `RootState`: It represents the root state of the Redux store. It is inferred using the ReturnType utility type to extract the state type from the store's getState method.
    - `AppDispatch`: It represents the type of the dispatch function provided by the Redux store. It is inferred as the type of the dispatch method of the store.

2.  **Reducers with createSlice():** Redux Toolkit introduces the createSlice() function, which reduces boilerplate code when creating reducers. It automatically generates action creators and action types based on the reducer function provided.

    ```javascript
    import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
    import axiosInstance from "../../api/axiosInstance";
    import { AxiosError } from "axios";
    import { RootState } from "@/store/store";

    // Initial State
    const initialState: AuthApiState = {
      token: typeof window !== "undefined" && localStorage.getItem("authToken")
        ? (JSON.parse(localStorage.getItem("authToken") || "").token as null)
        : null,
      userInfo: typeof window !== "undefined" && localStorage.getItem("authToken")
        ? (JSON.parse(localStorage.getItem("authToken") || "").userInfo as null)
        : null,
      status: "idle",
      error: null,
    };

    // Slice Creation
    const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
        builder
          .addCase(login.pending, (state) => {
            state.status = "loading";
            state.error = null;
          })
          .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
            state.status = "idle";
            state.token = action.payload;
          })
          .addCase(login.rejected, (state, action) => {
            state.status = "failed";
            if (action.payload) {
              state.error =
                (action.payload as ErrorResponse).message || "Login failed";
            } else {
              state.error = action.error.message || "Login failed";
            }
          });
      },
    });
    ```
    - The `extraReducers` field defines how the slice reducer responds to actions dispatched to the store.
    - Type safety with `extraReducers`: The `builder` object provides type safety for action types and payload types. It ensures that the action types and payload types match the action creators defined in the slice.

3.  **Asynchronous Actions with Redux Thunk:** Redux Toolkit integrates Redux Thunk middleware out of the box, enabling you to write asynchronous action creators that return functions instead of plain objects.
    ```javascript
    // Async Action Creator
    export const login = createAsyncThunk(
      "auth/login",
      async (data: User, { rejectWithValue }) => {
        try {
          const { data: response } = await axiosInstance.post("/login", data);
          const token: string = response.access_token;
          const authToken: AuthTokenState = {
            token,
          };
          localStorage.setItem("authToken", JSON.stringify(authToken));
          return token;
        } catch (error) {
          if (error instanceof AxiosError && error.response) {
            const errorResponse = error.response.data;
            return rejectWithValue(errorResponse);
          }
          throw error;
        }
      }
    );
    ```
    - The `createAsyncThunk` function in Redux Toolkit is a utility used to generate asynchronous thunk action creators for handling asynchronous logic, such as fetching data from an API.
      1. `type`: A string representing the action type. It's used to generate additional Redux action type constants representing the lifecycle of an async request.
      2. `payloadCreator`: A callback function that returns a promise containing the result of asynchronous logic. The payloadCreator function receives two arguments: arg and thunkAPI.
           - `arg`: A single value, containing the first parameter passed to the thunk action creator when it was dispatched.
          - `thunkAPI`: An object containing parameters like `dispatch`, `getState`, `extra`, `requestId`, `signal`, and utility functions like `rejectWithValue` and `fulfillWithValue`.
     - Returns a fulfilled promise containing the final dispatched action (either the fulfilled or rejected action object).

4. **Way to access the Redux store:** Redux Toolkit provides a `useSelector` hook that allows you to extract data from the Redux store state. It takes a selector function as an argument and returns the selected data from the store.
    ```javascript
    import { useAppSelector } from "../../../hooks/redux-hooks";
    
    const authReducer = useAppSelector(authSelector);

    <div>
      {authReducer.status === "loading" && <p>Loading...</p>}
      {authReducer.status === "failed" && <p>Error: {authReducer.error}</p>}
    </div>
    <h4>Name: {authReducer?.userInfo?.name}</h4>
    ```
    - The `useSelector` hook is a React hook that allows you to extract data from the Redux store state. It takes a selector function as an argument and returns the selected data from the store.
    - The `authSelector` function is a selector function that takes the root state as an argument and returns the auth slice of the state.
    - The `useAppSelector` hook is a custom hook that wraps the `useSelector` hook and provides type safety for the selected data.

5. **Dispatching Actions:** Redux Toolkit provides a `useDispatch` hook that allows you to dispatch actions to the Redux store. It returns a reference to the dispatch function provided by the Redux store.
    ```javascript
    import { useAppDispatch } from "../../../hooks/redux-hooks";

    const dispatch = useAppDispatch();

    const handleLogin = async () => {
      // This is only a basic validation of inputs. Improve this as needed.
      if (email && password) {
        const actionResult = await dispatch(login({ email, password }));
        if (login.fulfilled.match(actionResult)) {
          await dispatch(getUser());
          router.push("/home");
        } else if (login.rejected.match(actionResult)) {
          // Show error message
        }
      } else {
        // Show error message
      }
    };
    ```
    - The `useDispatch` hook is a React hook that returns a reference to the dispatch function provided by the Redux store.
    - The `useAppDispatch` hook is a custom hook that wraps the `useDispatch` hook and provides type safety for the dispatch function.
    - The `login` action creator is dispatched using the `dispatch` function. The `dispatch` function returns a promise containing the final dispatched action (either the fulfilled or rejected action object).

6. **Enhanced DevTools Integration:** Redux Toolkit integrates seamlessly with Redux DevTools Extension, offering a more intuitive debugging experience.
