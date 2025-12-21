/**
 * Export Utilities for Professional Workflows
 */

// 1. Generate Figma/CSS Copy Format
export function generateFigmaCopy(colorName, hex) {
    const cssVar = `--${colorName.toLowerCase().replace(/\s+/g, '-')}: ${hex};`;
    const figmaJson = `
/* CSS Variable */
${cssVar}

/* Figma / Sketch JSON */
{
  "name": "${colorName}",
  "value": "${hex}",
  "blendMode": "NORMAL"
}
    `.trim();
    return figmaJson;
}

// 2. Generate .ASE (Adobe Swatch Exchange) Binary
// ASE Format Logic:
// Header: "ASEF" (4 bytes) + Version 1.0 (4 bytes: 0x00010000) + Block Count (4 bytes)
// Block: Type (2 bytes), Length (4 bytes), Name (Len + UTF-16), Color Model (4 chars), Values...
export function generateASE(colorName, hex) {
    const buffer = [];

    // Helper to push bytes
    const push16 = (val) => { buffer.push((val >> 8) & 0xFF, val & 0xFF); };
    const push32 = (val) => { buffer.push((val >> 24) & 0xFF, (val >> 16) & 0xFF, (val >> 8) & 0xFF, val & 0xFF); };
    const pushString = (str) => {
        push16(str.length + 1); // Length includes null terminator
        for (let i = 0; i < str.length; i++) {
            push16(str.charCodeAt(i));
        }
        push16(0); // Null terminator
    };
    const pushFloat = (val) => {
        const view = new DataView(new ArrayBuffer(4));
        view.setFloat32(0, val, false); // Big Endian
        buffer.push(...new Uint8Array(view.buffer));
    };

    // Header "ASEF"
    buffer.push(0x41, 0x53, 0x45, 0x46);
    // Version 1.0
    push16(1); push16(0);
    // Block Count (1 Group + 1 Color)
    push32(2);

    // Block 1: Group Start
    push16(0xC001); // Type: Group Start
    // Length calculation deferred (Name length * 2 + 2)
    // Name: "ImageColorPickerAI"
    const groupName = "Traditional Chinese Colors";
    push32(2 + (groupName.length + 1) * 2);
    pushString(groupName);

    // Block 2: Color Entry
    // RGB Conversion
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;

    push16(0x0001); // Type: Color
    // Length: Name (len*2 + 2) + Model (4) + Values (3*4) + Type (2)
    const colorBlockLen = (colorName.length + 1) * 2 + 4 + 12 + 2;
    push32(colorBlockLen);
    pushString(colorName);

    // Color Model "RGB "
    buffer.push(0x52, 0x47, 0x42, 0x20);

    pushFloat(r);
    pushFloat(g);
    pushFloat(b);

    push16(0x0002); // Color Type: Normal

    return new Uint8Array(buffer);
}

export function downloadASE(colorName, hex) {
    const data = generateASE(colorName, hex);
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${colorName.replace(/\s+/g, '_')}.ase`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
