import "./App.css"
import {
  MantineProvider,
  ColorSchemeProvider,
  MantineThemeOverride,
} from "@mantine/core";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from "./components/layouts";
import HomeContext from "./state/index.context";
import { useCreateReducer } from "./hooks/useCreateReducer";
import { HomeInitialState, initialState } from "./state/index.state";
import CustomRouter from "./components/CustomRouter";

function App() {
  const myTheme: MantineThemeOverride = {
    colorScheme: "light",
    spacing: {
      chatInputPadding: "40px",
    },
  };
  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });
  return (
    <div className="App">
      <HomeContext.Provider
        value={{
          ...contextValue,
        }}
      >
        <ColorSchemeProvider
          colorScheme="light"
          toggleColorScheme={() => { }}
        >
          <MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
            <Layout>
              <CustomRouter />
            </Layout>
          </MantineProvider>
        </ColorSchemeProvider>
      </HomeContext.Provider>
    </div>
  );
}

export default App;
