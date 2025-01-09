import "./App.css"
import {
  MantineProvider,
  ColorSchemeProvider,
  MantineThemeOverride,
} from "@mantine/core";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from "./components/layouts";
import Setting from "./pages/Setting";
import TaskManage from "./pages/TaskManage";
import HomeContext from "./state/index.context";
import { useCreateReducer } from "./hooks/useCreateReducer";
import { HomeInitialState, initialState } from "./state/index.state";
import CustomRouter from "./components/CustomRouter";

function App() {
  const myTheme: MantineThemeOverride = {
    colorScheme: "dark",
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
          colorScheme="dark"
          toggleColorScheme={() => { }}
        >
          <MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
            <Layout>
              {/* <BrowserRouter>
              <Routes>
                <Route path="/settings" element={<Setting />} />
                <Route path="/task_management" element={<TaskManage />} />
                <Route path="*" element={<Setting />} />
              </Routes>
            </BrowserRouter> */}
              <CustomRouter />
            </Layout>
          </MantineProvider>
        </ColorSchemeProvider>
      </HomeContext.Provider>
    </div>
  );
}

export default App;
