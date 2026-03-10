const fs = require('fs');

const css = fs.readFileSync('styles/autoptimize_single_20389cd67021204d1930bd490eee99f3.css', 'utf8');
const ids = ['60639e3', '9824604', '863ce61', '851aa5a', '9297970', '6a7db7b'];

// Simple unminifier
let unminified = css.replace(/}/g, '}\n');
let lines = unminified.split('\n');

let output = '';
for (let line of lines) {
    if (line.includes('.elementor-916')) {
        // print formatted
        let formatted = line.replace(/{/g, ' {\n    ').replace(/;/g, ';\n    ').replace(/}/g, '\n}');
        output += formatted + '\n';
    }
}
fs.writeFileSync('extracted_styles.css', output);
