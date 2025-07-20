import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

// GET /api/admin/check-username?username=value - Check if username is available
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ 
        available: false, 
        message: 'El nombre de usuario debe tener al menos 3 caracteres' 
      });
    }

    if (username.length > 20) {
      return NextResponse.json({ 
        available: false, 
        message: 'El nombre de usuario no puede exceder 20 caracteres' 
      });
    }

    // Check if username contains only allowed characters (alphanumeric + underscore)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ 
        available: false, 
        message: 'El nombre de usuario solo puede contener letras, números y guiones bajos' 
      });
    }

    // Check if username exists in database
    const existingUsername = await query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (existingUsername.rows.length > 0) {
      return NextResponse.json({ 
        available: false, 
        message: 'Este nombre de usuario ya está en uso' 
      });
    }

    return NextResponse.json({ 
      available: true, 
      message: 'Nombre de usuario disponible' 
    });

  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}