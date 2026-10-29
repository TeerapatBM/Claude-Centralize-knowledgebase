export async function readDocument(file:File):Promise<{name:string;text:string;kind:'document';id:string}>{
 if(file.size>5*1024*1024)throw Error('Each file must be 5 MB or smaller.');
 const ext=file.name.split('.').pop()?.toLowerCase();let text='';
 if(['txt','md','csv','json','log','yaml','yml'].includes(ext||''))text=await file.text();
 else if(ext==='docx'){
  const mammoth=await import('mammoth/mammoth.browser');
  const bytes=await file.arrayBuffer(),view=new DataView(bytes);let expanded=0,count=0;for(let i=0;i+46<view.byteLength;i++)if(view.getUint32(i,true)===0x02014b50){expanded+=view.getUint32(i+24,true);count++;if(expanded>20*1024*1024||count>1000)throw Error('DOCX expanded content is too large.');}text=(await mammoth.extractRawText({arrayBuffer:bytes})).value;
 }else if(ext==='pdf'){
  const pdfjs=await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString();
  const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())});
  try{const document=await task.promise;if(document.numPages>100)throw Error('PDFs may contain at most 100 pages.');for(let i=1;i<=document.numPages;i++){const page=await document.getPage(i);const content=await page.getTextContent();const pageText=content.items.map((item:any)=>item.str||'').join(' ').trim();if(pageText)text+='\n[Page '+i+']\n'+pageText;if(text.length>80000)throw Error('Document exceeds 80,000 characters.');}}finally{await task.destroy();}
 }else throw Error('Supported files: PDF, DOCX, TXT, MD, CSV, JSON, LOG, YAML.');
 text=text.replace(/\u0000/g,'').trim();if(!text)throw Error('No text found. Scanned PDFs need OCR before upload.');if(text.length>80000)throw Error('Document exceeds 80,000 characters.');return {id:crypto.randomUUID(),name:file.name,text,kind:'document'};
}
