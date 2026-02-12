# Prisma Integration Guide (CommonJS + PostgreSQL Adapter)

This document outlines the steps taken to integrate Prisma into the project using CommonJS (Node.js `require`) and the PostgreSQL driver adapter.

## 1. Installation

We installed specific versions of Prisma compatible with Node.js v20.x and configured the necessary dependencies.

```bash
npm install prisma@5.22.0 @prisma/client@5.22.0 @prisma/adapter-pg@5.22.0 --save-exact
```

- `prisma`: The CLI tool.
- `@prisma/client`: The auto-generated query builder.
- `@prisma/adapter-pg`: Adapter to use the `pg` driver with Prisma (allows re-using existing connection pools).

## 2. Configuration (prisma/schema.prisma)

Updated `prisma/schema.prisma` to enable driver adapters and specify the output location.

```prisma
generator client {
  provider        = "prisma-client-js"
  output          = "../generated/prisma"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
}
```

## 3. Client Initialization (prisma/prismaClient.js)

Created a CommonJS module to initialize the Prisma Client using the `pg` pool. This ensures compatibility with the rest of the application which uses `require`.

**File:** `prisma/prismaClient.js`

```javascript
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
```

## 4. Generate Client

Run the generation command to create the client files in `generated/prisma`.

```bash
npx prisma generate
```

## 5. Usage

You can now import the initialized Prisma client in your controllers or other files.

```javascript
const prisma = require('../prisma/prismaClient');

// Example usage
async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}
```

## Troubleshooting Notes

- **Node Version**: Ensure Node.js is compatible with the Prisma version. We used v5.22.0 to support Node v20.5.0.
- **ESM vs CommonJS**: Since the project uses `require` (CommonJS), we avoided using `.ts` files for the client instance and ensured the generator provider is `prisma-client-js`.
