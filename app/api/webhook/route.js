export async function POST(request) {
  try {
    const body = await request.json();
    
    // Handle frame interactions here
    console.log('Webhook received:', body);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 