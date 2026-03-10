const fs = require('fs');

const css = fs.readFileSync('styles/autoptimize_single_c7178064e2b6641f6caf3a29a61fee99.css', 'utf8');
const ids = ['16c884b', '8cd3fc7', '7410c40'];

// Simple unminifier
let unminified = css.replace(/}/g, '}\n');
let lines = unminified.split('\n');

let output = '';
for (let line of lines) {
    if (ids.some(id => line.includes(id))) {
        // print formatted
        let formatted = line.replace(/{/g, ' {\n    ').replace(/;/g, ';\n    ').replace(/}/g, '\n}');
        output += formatted + '\n';
    }
}
fs.writeFileSync('extracted_styles.css', output);
