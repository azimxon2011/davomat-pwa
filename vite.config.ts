import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

function localExcelSavePlugin(): Plugin {
  const handler = (req: any, res: any, next: any) => {
    if (req.url === '/api/save-excel' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const { base64 } = JSON.parse(body);
          const buf = Buffer.from(base64, 'base64');
          const downloadsPath = 'C:\\Users\\ayubx\\Downloads\\AyuGram Desktop\\DAVOMAT.xlsx';
          const publicPath = path.resolve(process.cwd(), 'public', 'DAVOMAT.xlsx');
          fs.writeFileSync(publicPath, buf);
          if (fs.existsSync(path.dirname(downloadsPath))) {
            fs.writeFileSync(downloadsPath, buf);
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, error: err?.message }));
        }
      });
      return;
    }
    next();
  };

  return {
    name: 'local-excel-save',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localExcelSavePlugin()],
});
