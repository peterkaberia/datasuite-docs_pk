const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const OUTPUT_FILE = path.join(process.cwd(), 'datasuite-documentation.pdf');

async function generatePDF() {
  console.log('🚀 Initiating Headless Browser...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
   });
  const page = await browser.newPage();
  
  // 1. Visit the homepage to scrape the Nextra navigation sidebar
  console.log(`🌐 Connecting to ${BASE_URL} to read the Nextra sidebar...`);
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (error) {
    console.error(`❌ Could not connect to ${BASE_URL}. Is 'npm run start' running?`);
    await browser.close();
    return;
  }

  // Extract all internal URLs directly from the sidebar navigation
  const discoveredRoutes = await page.evaluate(() => {
    // Nextra's sidebar links are usually housed inside an <aside> tag
    const links = Array.from(document.querySelectorAll('aside a, nav a'));
    const urls = links
      .map(a => a.getAttribute('href'))
      // Keep only internal documentation links, ignore external links or anchors
      .filter(href => href && href.startsWith('/') && !href.startsWith('/#')); 
    
    // Remove duplicates while preserving Nextra's exact sidebar order
    return [...new Set(urls)];
  });

  if (discoveredRoutes.length === 0) {
    console.error('❌ No links found in the sidebar. Please verify the page loads correctly in your browser.');
    await browser.close();
    return;
  }

  console.log(`✨ Discovered ${discoveredRoutes.length} pages perfectly ordered by Nextra!`);
  console.log(discoveredRoutes);

  // 2. Generate the PDF
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < discoveredRoutes.length; i++) {
    const route = discoveredRoutes[i];
    const targetUrl = `${BASE_URL}${route}`;
    console.log(`📑 Rendering Page [${i + 1}/${discoveredRoutes.length}]: ${route}`);

    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Inject CSS overrides to hide Nextra's UI chrome (sidebars, navs, table of contents)
      await page.addStyleTag({
        content: `
          aside, nav, footer, .nextra-toc, .nextra-breadcrumb, button {
            display: none !important;
          }
          body, main, article {
            margin: 0 !important; 
            padding: 0 !important;
            max-width: 100% !important; 
            width: 100% !important;
          }
          pre, code, table, tr, .nextra-callout {
            page-break-inside: avoid !important;
          }
        `
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
        printBackground: true
      });

      const pageDoc = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pageDoc, pageDoc.getPageIndices());
      copiedPages.forEach((p) => mergedPdf.addPage(p));
      
    } catch (err) {
      console.error(`❌ Skipped route [${route}]:`, err.message);
    }
  }

  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(OUTPUT_FILE, mergedPdfBytes);
  
  console.log(`\n✅ Success! Compiled PDF saved to: ${OUTPUT_FILE}`);
  await browser.close();
}

generatePDF();