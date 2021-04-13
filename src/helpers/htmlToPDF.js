const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const yup = require("yup");

const TEMP_FOLDER = path.join(process.cwd(), "src/temp");

const CONTENT_SCHEMA = yup.object().shape({
  html: yup.string().required("Please provide an html ut8 string"),
  fileName: yup.string().required("Provide a file name e.g filename.pdf"),
});

module.exports = async (data) => {
  try {
    const isValid = await CONTENT_SCHEMA.isValid(data);

    if (!isValid) {
      const message = await CONTENT_SCHEMA.validate(data);
      return Promise.reject(message);
    }

    const { fileName, html } = data;

    const pdfPath = path.join(
      TEMP_FOLDER,
      fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`
    );

    const options = {
      width: "25cm",
      headerTemplate: "<p></p>",
      footerTemplate: "<p></p>",
      displayHeaderFooter: false,
      margin: {
        top: "10px",
        bottom: "30px",
      },
      printBackground: true,
      path: pdfPath,
    };

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
      waitUntil: "networkidle0",
    });

    await page.pdf(options);
    await browser.close();

    const pdfFile = fs.readFileSync(pdfPath, { encoding: "base64" });

    fs.unlink(pdfFile, (err) => {
      if (err) {
        console.log("UNLINK ERR => ", err);
      }
    });

    return Promise.resolve({ pdfFile });
  } catch (error) {
    return Promise.reject(error);
  }
};
