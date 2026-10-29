import type { Metadata } from 'next';
import './globals.css';
import './workspace.css';
import {appearanceBootstrap} from '../lib/appearance';
export const metadata:Metadata={title:'Commons — Claude knowledge workspace',description:'รวมบทสนทนาและความรู้ของทีม พร้อมแหล่งอ้างอิงและงานที่ต่อยอดได้'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="th" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:appearanceBootstrap}}/></head><body>{children}</body></html>}
