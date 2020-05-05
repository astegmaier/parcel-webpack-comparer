import { message, addStuff } from "fake-package";

ready(() => {
  const root = document.getElementById("root");
  if (root) {
    root.textContent = message + addStuff(3, 2);
  }
});

function ready(fn: any) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
