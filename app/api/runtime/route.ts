export const dynamic='force-dynamic';
export function GET(){return Response.json({deployment:'sites',auth:'sites',claudeOAuth:false},{headers:{'Cache-Control':'no-store'}});}
