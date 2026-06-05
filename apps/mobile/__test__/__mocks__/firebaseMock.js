module.exports = {
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({ exists: () => false, data: () => ({}) }),
  ),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(),
  auth: {},
  db: {},
};
