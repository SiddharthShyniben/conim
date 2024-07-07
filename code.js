// Draw a bouncing (DVD-style) rect
const rect = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 100,
  height: 50,
  dx: 2,
  dy: 2,
};

function interpolate(color1, color2, percent) {
  // Convert the hex colors to RGB values
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  // Interpolate the RGB values
  const r = Math.round(r1 + (r2 - r1) * percent);
  const g = Math.round(g1 + (g2 - g1) * percent);
  const b = Math.round(b1 + (b2 - b1) * percent);

  // Convert the interpolated RGB values back to a hex color
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

async function drawRect(tick) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.width, rect.height);
  ctx.fillStyle = interpolate("#ff0000", "#ffff00", tick / 100);
  ctx.fill();
  ctx.closePath();

  const image = canvas.toDataURL("image/png");
  await fetch("/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image }),
  });
}

async function updateRect(tick) {
  // Check if the rectangle is outside the canvas boundaries
  if (rect.x + rect.width >= canvas.width || rect.x <= 0) {
    rect.dx = -rect.dx;
  }

  if (rect.y + rect.height >= canvas.height || rect.y <= 0) {
    rect.dy = -rect.dy;
  }

  // Update the rectangle position
  rect.x += rect.dx;
  rect.y += rect.dy;

  await drawRect(tick);
}

async function draw(tick) {
  await updateRect(tick);
}
