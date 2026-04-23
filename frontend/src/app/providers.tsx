"use client";

import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "./registry";
import { store, persistor } from "@/lib/store";
import { theme } from "@/lib/theme";
import { GlobalStyle } from "@/lib/globalStyle";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ReduxProvider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            {children}
          </ThemeProvider>
        </PersistGate>
      </ReduxProvider>
    </StyledComponentsRegistry>
  );
}
