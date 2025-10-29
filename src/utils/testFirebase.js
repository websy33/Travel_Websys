// Test Firebase Firestore connection
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  console.log('🔍 Testing Firebase Firestore connection...\n');
  
  try {
    // Test 1: Write to Firestore
    console.log('Test 1: Writing test document...');
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test'
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Write successful! Document ID:', docRef.id);
    
    // Test 2: Read from Firestore
    console.log('\nTest 2: Reading test documents...');
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Read successful! Found', querySnapshot.size, 'documents');
    
    // Test 3: Delete test document
    console.log('\nTest 3: Deleting test document...');
    await deleteDoc(doc(db, 'test', docRef.id));
    console.log('✅ Delete successful!');
    
    console.log('\n✅ All tests passed! Firebase is working correctly.');
    return { success: true, message: 'Firebase connection is working!' };
    
  } catch (error) {
    console.error('\n❌ Firebase test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message
    });
    
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
};

// Make it available in browser console
if (typeof window !== 'undefined') {
  window.testFirebase = testFirebaseConnection;
}
