import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import GameBoard from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <GameBoard />
  </StrictMode>
);
