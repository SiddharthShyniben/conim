const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

//////INCLUDE//////

(async () => {
  let i = 0;
  while (i < 100) {
    await draw(i);
    const image = canvas.toDataURL("image/png");
    await fetch("/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    });
    i++;
  }

  await fetch("/done");
  window.close();
})();
