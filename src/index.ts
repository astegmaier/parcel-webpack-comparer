import { message1 } from "fake-package";

ready(() => {
  const root = document.getElementById("root");
  if (root) {
    root.textContent = message1;
  }
});

function ready(fn: () => void) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
