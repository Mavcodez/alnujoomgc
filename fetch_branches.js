import https from 'https';

https.get('https://nujoomdemo.netlify.app/assets/index-cEsSwtZS.js', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    // try to find branch names or JSON-like struct regarding branches
    const matches = data.match(/name:"[^"]+",address:"[^"]+"/g) || [];
    console.log("MATCHES1:", matches);
    
    // Fallback: look for generic structures with 'name', 'phone', 'address'
    const maybeBranches = data.match(/\{[^}]*name:"[^"]+"[^}]*phone:"[^"]+"[^}]*\}/g) || [];
    console.log("MATCHES2:", maybeBranches.slice(0, 20)); // Limit output

    if (maybeBranches.length === 0) {
      const match3 = data.match(/const [a-zA-Z0-9_]+=\[{id:[^]*?\]/);
      if (match3) console.log("MATCHES3:", match3[0].substring(0, 1000));
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
