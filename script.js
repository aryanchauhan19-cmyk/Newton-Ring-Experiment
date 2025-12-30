document.addEventListener("DOMContentLoaded", function () {


    const canvas = document.getElementById("ringsCanvas");
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const lambdaSlider = document.getElementById("lambda");
    const R_Slider = document.getElementById("radius");
    const zoomSlider = document.getElementById("zoom");

    const lambdaVal = document.getElementById("lambda-val");
    const R_Val = document.getElementById("R-val");
    const zoomVal = document.getElementById("zoom-val");


    const modeWavelength = document.getElementById("modeWavelength");
    const modeDiameter = document.getElementById("modeDiameter");

    const wavelengthInputs = document.getElementById("wavelengthInputs");
    const diameterInputs = document.getElementById("diameterInputs");

    const calculateBtn = document.getElementById("calculateBtn");
    const resultText = document.getElementById("result-text");


    function drawRings(highlight_n = 0, highlight_color = "red") {

        const lambda = parseFloat(lambdaSlider.value) / 1e9;
        const R = parseFloat(R_Slider.value);
        const pixelsPerMeter = parseFloat(zoomSlider.value);

        lambdaVal.innerText = lambdaSlider.value;
        R_Val.innerText = R_Slider.value;
        zoomVal.innerText = zoomSlider.value;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let n = 1; n < 50; n++) {
            const rn_meters = Math.sqrt(n * lambda * R);
            const rn_pixels = rn_meters * pixelsPerMeter;

            if (rn_pixels > centerX) break;

            ctx.beginPath();
            ctx.arc(centerX, centerY, rn_pixels, 0, 2 * Math.PI);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (highlight_n > 0) {
            const rn_meters_highlight = Math.sqrt(highlight_n * lambda * R);
            const rn_pixels_highlight = rn_meters_highlight * pixelsPerMeter;

            if (rn_pixels_highlight <= centerX) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, rn_pixels_highlight, 0, 2 * Math.PI);
                ctx.strokeStyle = highlight_color;
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        }
    }


    lambdaSlider.addEventListener("input", () => drawRings());
    R_Slider.addEventListener("input", () => drawRings());
    zoomSlider.addEventListener("input", () => drawRings());


    function updateCalcInputs() {
        if (modeWavelength.checked) {
            wavelengthInputs.style.display = "flex";
            diameterInputs.style.display = "none";
        } else {
            wavelengthInputs.style.display = "none";
            diameterInputs.style.display = "flex";
        }
    }
    modeWavelength.addEventListener("change", updateCalcInputs);
    modeDiameter.addEventListener("change", updateCalcInputs);


    calculateBtn.addEventListener("click", function () {


        if (modeWavelength.checked) {
            const m = parseFloat(document.getElementById("m_val").value);
            const n = parseFloat(document.getElementById("n_val").value);
            const R = parseFloat(document.getElementById("R_val_calc1").value);


            const Dm_mm = parseFloat(document.getElementById("Dm_val").value);
            const Dn_mm = parseFloat(document.getElementById("Dn_val").value);


            const Dm = Dm_mm / 1000.0;
            const Dn = Dn_mm / 1000.0;


            if (isNaN(m) || isNaN(Dm) || isNaN(n) || isNaN(Dn) || isNaN(R) || (m - n === 0) || R === 0) {
                resultText.innerText = "Please fill all fields with valid numbers.";
                return;
            }

            const Dm_squared = Dm * Dm;
            const Dn_squared = Dn * Dn;
            const lambda_meters = (Dm_squared - Dn_squared) / (4.0 * (m - n) * R);
            const lambda_nm = lambda_meters * 1e9;

            resultText.innerText = `Calculated Wavelength (λ) is: ${lambda_nm.toFixed(2)} nm`;

            lambdaSlider.value = lambda_nm.toFixed(2);
            R_Slider.value = R;
            drawRings();
        }


        else {

            const n = parseFloat(document.getElementById("n_val_calc2").value);
            const lambda_nm = parseFloat(document.getElementById("lambda_val_calc2").value);
            const R = parseFloat(document.getElementById("R_val_calc2").value);

            if (isNaN(n) || isNaN(lambda_nm) || isNaN(R)) {
                resultText.innerText = "Please fill all fields with valid numbers.";
                return;
            }

            const lambda_meters = lambda_nm / 1e9;
            const Dn_meters = Math.sqrt(4.0 * n * lambda_meters * R);
            const Dn_mm = Dn_meters * 1000;

            resultText.innerText = `Diameter (D_n) for ring ${n} is: ${Dn_mm.toFixed(4)} mm`;

            lambdaSlider.value = lambda_nm;
            R_Slider.value = R;
            drawRings(n, "red");
        }
    });


    drawRings();
    updateCalcInputs();
});