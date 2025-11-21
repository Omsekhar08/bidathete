import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UsersService } from '../../modules/users/users.service';
import { UserRole, AuthProvider } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    console.log('🌱 Seeding database...');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await usersService.create({
      name: 'Admin User',
      email: 'admin@bidathlete.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      authProvider: AuthProvider.EMAIL,
      isActive: true,
    });
    console.log('✅ Admin user created:', admin.email);

    // Create organiser user
    const organiser = await usersService.create({
      name: 'Demo Organiser',
      email: 'organiser@bidathlete.com',
      password: hashedPassword,
      role: UserRole.ORGANISER,
      authProvider: AuthProvider.EMAIL,
      organisationName: 'Demo Sports League',
      isActive: true,
    });
    console.log('✅ Organiser user created:', organiser.email);

    // Create team manager user
    const manager = await usersService.create({
      name: 'Demo Team Manager',
      email: 'manager@bidathlete.com',
      password: hashedPassword,
      role: UserRole.TEAM_MANAGER,
      authProvider: AuthProvider.EMAIL,
      isActive: true,
    });
    console.log('✅ Team Manager user created:', manager.email);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\nDefault credentials:');
    console.log('  admin@bidathlete.com / admin123');
    console.log('  organiser@bidathlete.com / admin123');
    console.log('  manager@bidathlete.com / admin123');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed();