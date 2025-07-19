import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserRole, checkPermission } from '@/lib/permissions';
import { generateSimplePassword, validateSimplePassword, getPasswordStrengthDescription, getPasswordStrengthDescriptionEN } from '@/lib/passwordGenerator';

// GET /api/admin/generate-password - Generate a simple password for students
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user can manage students (teachers, admins, owners)
    const userRole = await getUserRole(session.user.id);
    if (!userRole || !await checkPermission(session.user.id, 'canManageStudents')) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const generated = generateSimplePassword();

    return NextResponse.json({
      password: generated.password,
      words: generated.words,
      strength: generated.strength,
      description_es: getPasswordStrengthDescription(generated.password),
      description_en: getPasswordStrengthDescriptionEN(generated.password)
    });

  } catch (error) {
    console.error('Error generating password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/generate-password - Validate a custom simple password
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user can manage students (teachers, admins, owners)
    const userRole = await getUserRole(session.user.id);
    if (!userRole || !await checkPermission(session.user.id, 'canManageStudents')) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValid = validateSimplePassword(password);
    const descriptionES = getPasswordStrengthDescription(password);
    const descriptionEN = getPasswordStrengthDescriptionEN(password);

    return NextResponse.json({
      password,
      is_valid: isValid,
      description_es: descriptionES,
      description_en: descriptionEN,
      words: isValid ? password.split(' ') : [],
      strength: isValid && password.length >= 12 ? 'strong' : 'medium'
    });

  } catch (error) {
    console.error('Error validating password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}