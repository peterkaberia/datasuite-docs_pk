const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const OUTPUT_FILE = path.join(process.cwd(), 'datasuite-documentation.pdf');

// ==========================================
// 🎨 BEAUTIFICATION: Custom CSS & TOC Styling
// ==========================================
const PRINT_CSS = `
  /* Hide Nextra UI Elements */
  aside, nav, footer, .nextra-toc, .nextra-breadcrumb, button, .nx-edit-link {
    display: none !important;
  }
  /* Normalize Canvas and Typography */
  body, main, article {
    margin: 0 !important; 
    padding: 0 !important;
    max-width: 100% !important; 
    width: 100% !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    color: #1e293b !important;
    line-height: 1.7 !important;
  }
  /* Elegant Headers */
  h1 { font-size: 28pt !important; color: #0f172a !important; border-bottom: 2px solid #e2e8f0 !important; padding-bottom: 10px; margin-bottom: 20px; }
  h2 { font-size: 20pt !important; color: #334155 !important; margin-top: 30px !important; }
  h3 { font-size: 16pt !important; color: #475569 !important; }
  /* Beautify Code Blocks */
  pre {
    background-color: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 8px !important;
    padding: 16px !important;
    font-size: 10pt !important;
    page-break-inside: avoid !important;
  }
  code { background-color: #f1f5f9 !important; padding: 2px 6px !important; border-radius: 4px !important; color: #be123c !important; }
  pre code { background-color: transparent !important; color: inherit !important; padding: 0 !important; }
  /* Links & Tables */
  a { color: #2563eb !important; text-decoration: none !important; font-weight: 500 !important; }
  table { width: 100% !important; border-collapse: collapse !important; margin: 20px 0 !important; page-break-inside: avoid !important; }
  th { background-color: #f1f5f9 !important; border: 1px solid #cbd5e1 !important; padding: 10px !important; text-align: left !important; }
  td { border: 1px solid #e2e8f0 !important; padding: 10px !important; }
`;

async function generatePDF() {
  console.log('🚀 Initiating Headless Browser...');
  const browser = await puppeteer.launch({ 
      headless: "new",
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
     });
  const page = await browser.newPage();
  
  // 1. Visit homepage to scrape URLs AND Titles
  console.log(`🌐 Scraping Nextra sidebar for Table of Contents at ${BASE_URL}...`);
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (error) {
    console.error(`❌ Could not connect. Ensure 'npm run start' is running.`);
    await browser.close();
    return;
  }

  // Extract URLs + Titles for the TOC
  const pagesData = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('aside a, nav a'));
    const uniquePages = new Map();

    links.forEach(a => {
      const href = a.getAttribute('href');
      const title = a.innerText.trim();
      if (href && href.startsWith('/') && !href.startsWith('/#') && title) {
        if (!uniquePages.has(href)) {
          uniquePages.set(href, title);
        }
      }
    });
    
    return Array.from(uniquePages, ([url, title]) => ({ url, title }));
  });

  if (pagesData.length === 0) {
    console.error('❌ No links found in the sidebar.');
    await browser.close();
    return;
  }

  console.log(`✨ Discovered ${pagesData.length} pages. Building documentation...`);

  const mergedPdf = await PDFDocument.create();

  // ==========================================
  // 2. BUILD THE COVER & TABLE OF CONTENTS
  // ==========================================
  console.log('📑 Generating Cover Page and Table of Contents...');
  const tocHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
        .cover { height: 800px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        .cover h1 { font-size: 48px; color: #0f172a; margin-bottom: 10px; }
        .cover p { font-size: 20px; color: #64748b; }
        .toc-header { font-size: 32px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 30px; page-break-before: always; }
        .toc-item { font-size: 16px; margin-bottom: 12px; display: flex; align-items: baseline; }
        .toc-title { font-weight: 600; color: #334155; }
        .toc-url { font-size: 12px; color: #94a3b8; margin-left: auto; }
      </style>
    </head>
    <body>
      <div class="cover">
        <h1>DataSuite Documentation</h1>
        <p>Official Technical Manual & Reference Guide</p>
        <p style="margin-top: 50px; font-size: 14px; color: #94a3b8;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      <h2 class="toc-header">Table of Contents</h2>
      ${pagesData.map((p, i) => `
        <div class="toc-item">
          <span class="toc-title">${i + 1}. ${p.title}</span>
          <span class="toc-url">${p.url}</span>
        </div>
      `).join('')}
    </body>
    </html>
  `;

  await page.setContent(tocHTML, { waitUntil: 'load' });
  const tocBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' } });
  const tocPdfDoc = await PDFDocument.load(tocBuffer);
  const tocPages = await mergedPdf.copyPages(tocPdfDoc, tocPdfDoc.getPageIndices());
  tocPages.forEach(p => mergedPdf.addPage(p));

  // ==========================================
  // 3. RENDER AND MERGE ALL DOCUMENTATION PAGES
  // ==========================================
  for (let i = 0; i < pagesData.length; i++) {
    const { url, title } = pagesData[i];
    const targetUrl = `${BASE_URL}${url}`;
    console.log(`🖨️  Rendering [${i + 1}/${pagesData.length}]: ${title} (${url})`);

    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Inject the beautification CSS
      await page.addStyleTag({ content: PRINT_CSS });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        // Inject native Page Numbers using Puppeteer Headers/Footers
        displayHeaderFooter: true,
        headerTemplate: '<div></div>', // Empty header
        footerTemplate: `
          <div style="font-size: 9px; width: 100%; text-align: center; color: #94a3b8; font-family: sans-serif;">
            DataSuite Documentation — Page <span class="pageNumber"></span>
          </div>
        `,
        margin: { top: '25mm', bottom: '25mm', left: '20mm', right: '20mm' }
      });

      const pageDoc = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pageDoc, pageDoc.getPageIndices());
      copiedPages.forEach(p => mergedPdf.addPage(p));
      
    } catch (err) {
      console.error(`❌ Skipped route [${url}]:`, err.message);
    }
  }

  // ==========================================
  // 4. SAVE FINAL FILE
  // ==========================================
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(OUTPUT_FILE, mergedPdfBytes);
  
  console.log(`\n✅ Success! Beautifully formatted PDF saved to: ${OUTPUT_FILE}`);
  await browser.close();
}

generatePDF();