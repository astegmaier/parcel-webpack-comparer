import { message } from "fake-package";

ready(() => {
  const root = document.getElementById("root");
  if (root) {
    root.textContent = message;
  }
});

function ready(fn: any) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
