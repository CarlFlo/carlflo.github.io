async function combinePDFs() {
  try {
    const elements = [...document.getElementsByTagName("input")];

    const files = [];
    for (const element of elements) {
      // Handles cases where multiple files were added within a single "input" element
      for (const file of element.files) {
        files.push(file);
      }
    }

    // Check if we got at least two files
    if (files.length < 2) {
      throw new Error("Please select two PDF files");
    }

    const resultPDF = await PDFLib.PDFDocument.create();
    // Iterate over all the pages in each PDF file and append them to the new output PDF
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(buffer);
      const pages = await resultPDF.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => {
        resultPDF.addPage(page);
      });
    }

    const combinedPdfBytes = await resultPDF.save();
    const combinedPdfBlob = new Blob([combinedPdfBytes], {
      type: "application/pdf",
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(combinedPdfBlob);
    downloadLink.download = "combined.pdf";
    downloadLink.click();
  } catch (error) {
    alert(error);
    return;
  }
}

function clearFiles() {
  const elements = [...document.getElementsByTagName("input")];

  for (var element of elements) {
    element.value = "";
  }
}
