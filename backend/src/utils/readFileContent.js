// accepted formats = .txt, .pdf, .docx, .xls, .xlsx, .csv

import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import xlsx from 'xlsx';
import csv from 'csv-parser';
import { Readable } from 'stream';

export const readFileContent = async (filePath, originalName) => {
  const extension = path.extname(originalName).toLowerCase();
  let text = '';

    try {
        if (extension === '.txt') {
            text = fs.readFileSync(filePath, 'utf8');
        } 
        else if (extension === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            text = data.text;
        } 
        else if (extension === '.docx') {
            const buffer = fs.readFileSync(filePath);
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } 
        else if (extension === '.csv') {
            const buffer = fs.readFileSync(filePath);
            text = await parseCSV(buffer);
        } 
        else if (extension === '.xls' || extension === '.xlsx') {
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            text = xlsx.utils.sheet_to_csv(sheet);
        }
        else {
            throw new Error('Unsupported file format');
        }
        return text;
    } 
    catch (error) {
        console.error('Error reading file:', error.message);
        throw new Error("Unsupported file format");
    }finally{
        fs.unlinkSync(filePath);
    }
    
};

const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer);
    let text = '';

    stream
      .pipe(csv())
      .on('data', (row) => {
        text += Object.values(row).join(' ') + ' ';
      })
      .on('end', () => resolve(text))
      .on('error', reject);
  });
};
