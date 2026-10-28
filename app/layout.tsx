import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Commons — Claude knowledge workspace',description:'รวมบทสนทนาและความรู้ของทีม พร้อมแหล่งอ้างอิงและงานที่ต่อยอดได้'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="th"><body>{children}</body></html>}
