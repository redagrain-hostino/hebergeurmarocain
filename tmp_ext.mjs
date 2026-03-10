import https from 'https';

https.get('https://hebergeurmarocain.com/', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    // Look for ade6447 in the entire page
    const re = /\.elementor-.*(?:ade6447|aa69353|39d55cc).*?\{[^\}]+\}/g;
    let m;
    while(m = re.exec(data)) {
        console.log(m[0]);
    }
    
    // Check h2 wdes-section-header
    const hr = /\.wdes-section-header-primary[^\}]*\{[^\}]+\}/g;
    while(m = hr.exec(data)) {
        console.log(m[0]);
    }
  });
});
