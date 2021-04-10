export const TEXTURE_VERT = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    uniform mat4 u_matrix;
    void main () {
        gl_Position = u_matrix * a_position;
        v_texCoord = a_texCoord;
    }
`;

export const TEXTURE_FRAG = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main () {
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`;
