import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {appearanceBootstrap} from './lib/appearance';
export default defineConfig({root:'onprem/web',publicDir:'../../public',plugins:[react(),{name:'commons-prepaint',transformIndexHtml(html){return html.replace('</head>',`<script>${appearanceBootstrap}</script></head>`);}}],build:{outDir:'../../onprem-dist',emptyOutDir:true}});
