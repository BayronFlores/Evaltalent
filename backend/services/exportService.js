const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

class ExportService {
  static async exportToPDF(reportData, reportName, res) {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${reportName}.pdf"`,
    );
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    doc.pipe(res);

    // Título
    doc.fontSize(20).text(reportName, { align: 'center' });
    doc.moveDown();

    // Fecha de generación
    doc
      .fontSize(12)
      .text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, {
        align: 'right',
      });
    doc.moveDown();

    // Datos
    if (Array.isArray(reportData) && reportData.length > 0) {
      const headers = Object.keys(reportData[0]);

      // Headers
      doc.fontSize(10);
      let yPosition = doc.y;
      headers.forEach((header, index) => {
        doc.text(header.toUpperCase(), 50 + index * 80, yPosition, {
          width: 75,
        });
      });

      doc.moveDown();

      // Datos
      reportData.forEach((row) => {
        yPosition = doc.y;
        headers.forEach((header, index) => {
          const value = row[header] || '';
          doc.text(String(value), 50 + index * 80, yPosition, { width: 75 });
        });
        doc.moveDown(0.5);

        // Nueva página si es necesario
        if (doc.y > 700) {
          doc.addPage();
        }
      });
    }

    doc.end();
  }

  static async exportToExcel(reportData, reportName, res) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    if (Array.isArray(reportData) && reportData.length > 0) {
      // Headers
      const headers = Object.keys(reportData[0]);
      worksheet.columns = headers.map((header) => ({
        header: header.toUpperCase(),
        key: header,
        width: 20,
      }));

      // Datos
      worksheet.addRows(reportData);

      // Estilo para headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${reportName}.xlsx"`,
    );
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    await workbook.xlsx.write(res);
    res.end();
  }
}

module.exports = ExportService;
