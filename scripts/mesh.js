    // Contact Multi-Step Form Logic (customized)
    document.addEventListener("DOMContentLoaded", function () {
      const steps = [
        document.getElementById("contact-step-1"),
        document.getElementById("contact-step-2"),
        document.getElementById("contact-step-3"),
        document.getElementById("contact-step-4"),
      ];
      const progressBar = document.getElementById("contact-progress-bar");
      let currentStep = 0;
      function showStep(idx) {
        steps.forEach((step, i) => {
          if (step) step.classList.toggle("hidden", i !== idx);
        });
        progressBar.style.width = ((idx + 1) / steps.length) * 100 + "%";
      }
      // Genre radio logic
      const genreRadios = document.querySelectorAll('input[name="genre"]');
      const genreOther = document.getElementById("contact-genre-other");
      genreRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
          if (this.value === "Other") {
            genreOther.style.display = "";
            genreOther.required = true;
          } else {
            genreOther.style.display = "none";
            genreOther.required = false;
          }
        });
      });
      // Next/Back logic
      document.getElementById("contact-next-1").onclick = function () {
        if (
          document.getElementById("contact-name").value.trim() &&
          document.getElementById("contact-email").value.trim()
        ) {
          showStep(1);
          currentStep = 1;
        }
      };
      document.getElementById("contact-back-2").onclick = function () {
        showStep(0);
        currentStep = 0;
      };
      document.getElementById("contact-next-2").onclick = function () {
        if (
          document.getElementById("contact-idea").value.trim() &&
          (document.querySelector('input[name="genre"]:checked') ||
            genreOther.value.trim()) &&
          document.getElementById("contact-budget").value
        ) {
          // Fill review step
          document.getElementById("review-contact-name").textContent =
            document.getElementById("contact-name").value;
          document.getElementById("review-contact-email").textContent =
            document.getElementById("contact-email").value;
          document.getElementById("review-contact-affiliation").textContent =
            document.getElementById("contact-affiliation").value;
          document.getElementById("review-contact-idea").textContent =
            document.getElementById("contact-idea").value;
          let genre = document.querySelector('input[name="genre"]:checked');
          genre = genre
            ? genre.value === "Other"
              ? genreOther.value
              : genre.value
            : "";
          document.getElementById("review-contact-genre").textContent = genre;
          document.getElementById("review-contact-budget").textContent =
            document.getElementById("contact-budget").value;
          showStep(2);
          currentStep = 2;
        }
      };
      document.getElementById("contact-back-3").onclick = function () {
        showStep(1);
        currentStep = 1;
      };
      // Submit handler
      document.getElementById("contact-multistep-form").onsubmit = function (
        e
      ) {
        e.preventDefault();
        showStep(3);
        // Applause/confetti effect
        if (window.confetti) {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.7 },
          });
        }
        setTimeout(() => {
          showStep(0);
          this.reset();
        }, 3500);
      };
      // Init
      showStep(0);
    });
    // Animated Mesh (wavy grid) background for the entire page
    const meshCanvas = document.getElementById("mesh-canvas");
    const meshCtx = meshCanvas.getContext("2d");
    console.log(meshCtx)
    function resizeMeshCanvas() {
      meshCanvas.width = window.innerWidth;
      meshCanvas.height = window.innerHeight;
    }
    resizeMeshCanvas();

    let meshWidth = meshCanvas.width;
    let meshHeight = meshCanvas.height;

    function drawMesh(time) {
      meshWidth = meshCanvas.width;
      meshHeight = meshCanvas.height;
      const meshRows = 18;
      const meshCols = 32;
      const meshSpacingX = meshWidth / (meshCols - 1);
      const meshSpacingY = meshHeight / (meshRows - 1);
      meshCtx.clearRect(0, 0, meshWidth, meshHeight);
      meshCtx.strokeStyle = "rgba(34,34,34,0.08)";
      meshCtx.lineWidth = 1.2;
      for (let y = 0; y < meshRows; y++) {
        meshCtx.beginPath();
        for (let x = 0; x < meshCols; x++) {
          const px = x * meshSpacingX;
          const py =
            y * meshSpacingY +
            Math.sin(x / 2 + time / 900 + y) * 10 +
            Math.cos(y / 2 + time / 1200 + x) * 6;
          if (x === 0) {
            meshCtx.moveTo(px, py);
          } else {
            meshCtx.lineTo(px, py);
          }
        }
        meshCtx.stroke();
      }
      for (let x = 0; x < meshCols; x++) {
        meshCtx.beginPath();
        for (let y = 0; y < meshRows; y++) {
          const px = x * meshSpacingX + Math.sin(y / 2 + time / 1100 + x) * 2;
          const py = y * meshSpacingY + Math.cos(x / 2 + time / 1300 + y) * 2;
          if (y === 0) {
            meshCtx.moveTo(px, py);
          } else {
            meshCtx.lineTo(px, py);
          }
        }
        meshCtx.stroke();
      }
      requestAnimationFrame(drawMesh);
    }
    requestAnimationFrame(drawMesh);

    window.addEventListener("resize", () => {
      resizeMeshCanvas();
      meshWidth = meshCanvas.width;
      meshHeight = meshCanvas.height;
    });
