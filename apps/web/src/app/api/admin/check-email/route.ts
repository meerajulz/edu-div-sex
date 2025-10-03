import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';

// GET /api/admin/check-email?email=value - Check if email is available
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        available: false, 
        message: 'Formato de email inválido' 
      });
    }

    if (email.length > 255) {
      return NextResponse.json({ 
        available: false, 
        message: 'El email no puede exceder 255 caracteres' 
      });
    }

    // Check if email exists in database (excluding deleted users)
    const existingEmail = await query(
      'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email.toLowerCase()]
    );

    if (existingEmail.rows.length > 0) {
      return NextResponse.json({
        available: false,
        message: 'Este email ya está registrado'
      });
    }

    return NextResponse.json({ 
      available: true, 
      message: 'Email disponible' 
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}