// Compare critical UI strings between deployed and local
fetch('https://algorhythm-fest.vercel.app/assets/index-eo8RrvQ6.js')
  .then(r => r.text())
  .then(js => {
    const strings = [
      'Event Controls Access',
      'Secondary authentication required',
      'Unlock Event Controls',
      'controlsPassInput',
      'Manage Access',
      'Email Access',
      'Theme Reveal Access',
      'Event Mailer Access',
      'Unlock Manage',
      'Unlock Email',
      'Unlock Theme',
      'Unlock Mailer',
      'controls',
      'manage',
      'email',
      'theme',
      'mailer',
      'Secondary Password',
      'secondary authentication required to toggle',
      'toggle event statuses',
      'Event Registerations Control',
    ];
    
    console.log('=== DEPLOYED BUNDLE CHECK ===');
    strings.forEach(s => {
      if (js.includes(s)) {
        console.log(`  ✅ "${s}"`);
      } else {
        console.log(`  ❌ "${s}"`);
      }
    });
  })
  .catch(err => console.error('Error:', err.message));
