import https from 'https';

https.get('https://hebergeurmarocain.com/', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    // extract inline styles
    const styles = data.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
    if(styles){
        styles.forEach(s => {
            if(s.match(/ade6447|aa69353|39d55cc|wdes-widget-section-header/)) {
                console.log(s);
            }
        });
    }

    // extract links
    let links = [];
    const linkMatches = data.matchAll(/<link[^>]+href="([^"]+css[^"]*)"/g);
    for (const match of linkMatches) {
        links.push(match[1]);
    }
    console.log("LINKS:");
    console.log(links.filter(l => l.includes('post-') || l.includes('elementor')));
  });
}).on('error', e => console.error(e));
