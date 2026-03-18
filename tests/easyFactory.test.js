import Factory from '../src/easyFactory';

describe('easyFactory (Factory base class)', () => {
  describe('Factory.getClass()', () => {
    it('should be a static method', () => {
      expect(typeof Factory.getClass).toBe('function');
    });

    it('should throw error when called on base class', () => {
      expect(() => {
        Factory.getClass({ type: 'test' });
      }).toThrow('This method should be implemented in the factory subclasses');
    });

    it('should include context in the error message', () => {
      expect(() => {
        Factory.getClass({ type: 'special' });
      }).toThrow(/Context: \[object Object\]/);
    });
  });

  describe('Factory.create()', () => {
    it('should be a static method', () => {
      expect(typeof Factory.create).toBe('function');
    });

    it('should throw error when called on base class (delegates to getClass)', () => {
      expect(() => {
        Factory.create({ type: 'test' });
      }).toThrow('This method should be implemented in the factory subclasses');
    });
  });

  describe('Subclass implementation', () => {
    class AdminUser {
      constructor(name) {
        this.name = name;
        this.role = 'admin';
      }
    }

    class RegularUser {
      constructor(name) {
        this.name = name;
        this.role = 'user';
      }
    }

    class UserFactory extends Factory {
      static getClass(context) {
        if (context.type === 'admin') {
          return AdminUser;
        } else if (context.type === 'user') {
          return RegularUser;
        }
        throw new Error('Unknown user type');
      }
    }

    it('should create correct subclass instance for admin', () => {
      const admin = UserFactory.create({ type: 'admin' }, 'John');
      expect(admin).toBeInstanceOf(AdminUser);
      expect(admin.role).toBe('admin');
      expect(admin.name).toBe('John');
    });

    it('should create correct subclass instance for user', () => {
      const user = UserFactory.create({ type: 'user' }, 'Jane');
      expect(user).toBeInstanceOf(RegularUser);
      expect(user.role).toBe('user');
      expect(user.name).toBe('Jane');
    });

    it('should create different instances for different types', () => {
      const admin = UserFactory.create({ type: 'admin' }, 'Admin User');
      const user = UserFactory.create({ type: 'user' }, 'Regular User');

      expect(admin).toBeInstanceOf(AdminUser);
      expect(user).toBeInstanceOf(RegularUser);
    });

    it('should pass multiple arguments to constructor', () => {
      class ExtendedUser {
        constructor(name, email, age) {
          this.name = name;
          this.email = email;
          this.age = age;
        }
      }

      class ExtendedFactory extends Factory {
        static getClass() {
          return ExtendedUser;
        }
      }

      const user = ExtendedFactory.create({}, 'Alice', 'alice@example.com', 30);
      expect(user.name).toBe('Alice');
      expect(user.email).toBe('alice@example.com');
      expect(user.age).toBe(30);
    });

    it('should handle no extra arguments', () => {
      class SimpleItem {
        constructor() {
          this.initialized = true;
        }
      }

      class SimpleFactory extends Factory {
        static getClass() {
          return SimpleItem;
        }
      }

      const result = SimpleFactory.create({});
      expect(result).toBeInstanceOf(SimpleItem);
      expect(result.initialized).toBe(true);
    });

    it('should throw for unknown context type', () => {
      expect(() => {
        UserFactory.create({ type: 'unknown' });
      }).toThrow('Unknown user type');
    });
  });
});
