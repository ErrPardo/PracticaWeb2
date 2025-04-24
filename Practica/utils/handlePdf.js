const PDFdocument=require('pdfkit')
const fs = require('fs')

const sendPdf=(req,res,next)=>{
    const albaran=req.albaran
    const doc=new PDFdocument()
    
    doc.pipe(fs.createWriteStream(`./pdfs/albaran${albaran.clientId.name}.pdf`)) 

    // Título
    doc.fontSize(20).text('Albarán de Trabajo', { align: 'center' })
    doc.moveDown(1.5)

    // Datos del Usuario
    doc.fontSize(12).text(`Usuario:(${albaran.userId.email || ''})`)
    
    // Proyecto
    const project = albaran.projectId
    if (project) {
      doc.text(`Proyecto: ${project.name || ''}`)
      doc.text(`Dirección: ${project.address.street || ''} ${project.address.number || ''}, ${project.address.postal || ''} ${project.address.city || ''}, ${project.address.province || ''}`)
    }

    // Cliente
    const client = albaran.clientId;
    if (client) {
      doc.text(`Cliente: ${client.companyName || client.name || 'N/A'}`)
    }

    doc.moveDown(1);
    doc.text(`Fecha del trabajo: ${new Date(albaran.workdate).toLocaleDateString()}`)
    doc.moveDown();

    // Descripción
    doc.fontSize(14).text('Descripción del trabajo', { underline: true })
    doc.fontSize(12).text(albaran.description || '-')
    doc.moveDown()

    // Horas trabajadas
    if (albaran.format === 'hours') {
      doc.fontSize(12).text(`Formato: Horas`)
      doc.text(`Total horas trabajadas: ${albaran.hours || 0}`)
      if (albaran.multi && albaran.multi.length > 0) {
        doc.moveDown();
        doc.text('Detalle por trabajador:', { underline: true })
        albaran.multi.forEach((entry, i) => {
          doc.text(`${i + 1}. ${entry.name} - ${entry.hours} h - ${entry.description}`)
        });
      }
    }

    // Materiales
    if (albaran.format === 'materials') {
      doc.fontSize(12).text(`Formato: Materiales`)
      if (albaran.materials && albaran.materials.length > 0) {
        doc.moveDown();
        doc.text('Lista de materiales:', { underline: true })
        albaran.materials.forEach((mat, i) => {
          doc.text(`${i + 1}. ${mat.description} - Cantidad: ${mat.quantity}`)
        });
      }
    }

    doc.moveDown(1)

    // Firma
    if (albaran.sign) {
      doc.text('Documento firmado', { align: 'left' })
      doc.moveDown(0.5)
    } else {
      doc.text('Documento no firmado', { align: 'left' })
    }

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers)
        req.pdf = {
            buffer: pdfBuffer,
            originalname: `albaran${albaran.clientId.name}.pdf`,
            mimetype: 'application/pdf'
        }
    })

    

    doc.end()
    
    next()
    
}

module.exports=sendPdf