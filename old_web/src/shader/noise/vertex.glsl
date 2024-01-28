out vec2 vUv;
out vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}