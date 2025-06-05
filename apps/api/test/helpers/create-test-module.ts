import {Test, TestingModuleBuilder} from '@nestjs/testing';
import {ConfigModule} from '@nestjs/config';

interface TestModuleOptions {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
}

// helper function that ensures the values in .env.test get
// loaded before any tests are run.
export function createTestModuleBuilder(
  options: TestModuleOptions = {},
): TestingModuleBuilder {
  const {controllers = [], providers = [], imports = []} = options;
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: '.env.test',
        isGlobal: true,
      }),
      ...imports,
    ],
    providers,
    controllers,
  });
}
