/**
 * Run once to create 3 dummy cashier accounts:
 *   npx ts-node -r tsconfig-paths/register src/seed-cashiers.ts
 */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cashiers = [
  { email: 'cashier1@mirhapret.com', first_name: 'Ayesha', last_name: 'Khan', password: 'Cashier@123' },
  { email: 'cashier2@mirhapret.com', first_name: 'Bilal',  last_name: 'Ahmed', password: 'Cashier@123' },
  { email: 'cashier3@mirhapret.com', first_name: 'Sara',   last_name: 'Malik', password: 'Cashier@123' },
];

async function seed() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'ecommerce_db',
    synchronize: false,
    logging: false,
  });

  await ds.initialize();

  for (const cashier of cashiers) {
    const existing = await ds.query(`SELECT id FROM users WHERE email = $1`, [cashier.email]);
    if (existing.length > 0) {
      console.log(`→ Already exists: ${cashier.email}`);
      continue;
    }

    const hash = await bcrypt.hash(cashier.password, 10);
    await ds.query(
      `INSERT INTO users (id, email, password, first_name, last_name, role, is_active)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'cashier', true)`,
      [cashier.email, hash, cashier.first_name, cashier.last_name],
    );
    console.log(`✓ Cashier created: ${cashier.email}  (password: ${cashier.password})`);
  }

  await ds.destroy();
  console.log('\nDone. Run the POS app and log in with any of the above accounts.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
