import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: string
      username?: string
      first_name?: string
      last_name?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role?: string
    username?: string
    first_name?: string
    last_name?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    username?: string
    first_name?: string
    last_name?: string
  }
}