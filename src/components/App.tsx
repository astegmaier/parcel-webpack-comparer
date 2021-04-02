import React from "react";

// More granular imports result in a smaller bundle size (~630kb). The main driver is that @fluentui/react-icons-northstar don't get imported.
// import Box from "@fluentui/react-northstar/dist/es/components/Box/Box";
// import Provider from "@fluentui/react-northstar/dist/es/components/Provider/Provider";
// import teamsTheme from "@fluentui/react-northstar/dist/es/themes/teams";

// Less granular imports (relying on index files that re-export stuff) gives a larger bundle (~1.1MB).
import { Provider, teamsTheme, Box } from "@fluentui/react-northstar";

const App = () => (
  <Provider theme={teamsTheme}>
    <Box content="Hello from FluentUI with a string change!" />
  </Provider>
);

export default App;
