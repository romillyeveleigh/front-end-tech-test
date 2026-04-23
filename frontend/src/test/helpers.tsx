import type { ReactNode } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { render } from "@testing-library/react";
import { tradesApi } from "@/lib/api/tradesApi";
import uiReducer from "@/lib/slices/uiSlice";
import { theme } from "@/lib/theme";

function makeTestStore() {
  return configureStore({
    reducer: combineReducers({
      ui: uiReducer,
      [tradesApi.reducerPath]: tradesApi.reducer,
    }),
    middleware: (getDefault) => getDefault().concat(tradesApi.middleware),
  });
}

export function renderWithProviders(ui: ReactNode) {
  const store = makeTestStore();
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>,
  );
}
