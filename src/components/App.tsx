import React from "react";
import { Provider, themes, Button } from "@fluentui/react-northstar";

const App = () => (
  <Provider theme={themes.teams}>
    <Button content="Hello from FluentUI" />
  </Provider>
);

export default App;
