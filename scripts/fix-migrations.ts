import fs from 'fs';
import path from 'path';

const migrationsDir = './drizzle/migrations';

if (fs.existsSync(migrationsDir)) {
	fs.readdirSync(migrationsDir).forEach(file => {
		const filePath = path.join(migrationsDir, file);
		if (file.endsWith('.sql')) {
			let content = fs.readFileSync(filePath, 'utf8');

			// Add IF NOT EXISTS to CREATE TABLE
			content = content.replace(/CREATE TABLE\s+("?\w+"?)\s+\(/g, (match, tableName) => {
				return `CREATE TABLE IF NOT EXISTS ${tableName} (`;
			});

			fs.writeFileSync(filePath, content);
			console.log(`✅ Patched ${file}`);
		}
	});
} else {
	console.log(`🟡 Migrations directory '${migrationsDir}' not found. Skipping patch.`);
}