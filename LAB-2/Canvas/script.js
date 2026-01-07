const canvas = document.getElementById("Canvas");
    const ctx = canvas.getContext("2d"); // 2D context is used for drawing shapes [web:19]

    // Filled rectangle
    ctx.fillStyle = "lightblue";
    // fillRect(x, y, width, height) draws a filled rectangle [web:10]
    ctx.fillRect(20, 20, 150, 80);

    // Filled circle
    ctx.beginPath();
    // arc(x, y, radius, startAngle, endAngle) with 0 to 2 * Math.PI draws a full circle [web:8][web:11]
    ctx.arc(350, 80, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "orange";
    ctx.fill();

    // Straight line
    ctx.beginPath();
    ctx.moveTo(50, 200);   // starting point of the line [web:1][web:12]
    ctx.lineTo(450, 250);  // end point of the line
    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Text inside the canvas
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    // fillText(text, x, y) draws filled text on the canvas [web:1][web:16]
    ctx.fillText("HTML5 Canvas", 160, 150);