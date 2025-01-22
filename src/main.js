// Get the canvas element from the HTML
const canvas = document.getElementById('webglCanvas');

// Initialize WebGL context
const gl = canvas.getContext('webgl');

// Check if WebGL is supported
if (!gl) {
    console.log('WebGL not supported, falling back to experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
    alert('Your browser does not support WebGL');
}

// Define the vertex shader source code
const vertexShaderSource = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
    }
`;

// Define the fragment shader source code
const fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Set color to red
    }
`;

// Compile the shader program
function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('ERROR compiling shader: ' + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

// Create a shader program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('ERROR linking shader program: ' + gl.getProgramInfoLog(shaderProgram));
}

// Use the shader program
gl.useProgram(shaderProgram);

// Define the geometry (a simple triangle)
const vertices = new Float32Array([
    0.0,  0.5, 0.0,
   -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
]);

// Create a buffer and upload the geometry data to WebGL
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Get the attribute location for a_Position and point to the vertex data
const a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_Position);

// Clear the canvas and draw the geometry
gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color to black
gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas
gl.drawArrays(gl.TRIANGLES, 0, 3); // Draw the triangle
