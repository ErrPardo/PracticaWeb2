const PDFdocument=require('pdfkit')

const sendPdf=(text,res)=>{
    const doc=new PDFdocument()
    res.setHeader('Content-Disposition','attacgment; filename=documento.pdf')
    res.setHeader('Content-Type','application/pdf')
    doc.pipe(res)
    doc.text("Generando un texto en un pdf")
    doc.end()
}

module.exports=sendPdf