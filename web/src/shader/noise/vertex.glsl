out vec2 vUv;
out vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;

    // Vertex shader output
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //gl_Position =  vec4( position, 1.0 );
}