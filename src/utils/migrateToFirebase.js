// Migration utility to move localStorage data to Firebase Firestore
import hotelStorage from './hotelStorage';

export const migrateLocalStorageToFirebase = async () => {
  try {
    console.log('Starting migration from localStorage to Firebase...');
    
    // Get data from localStorage
    const hotels = JSON.parse(localStorage.getItem('kashmirStays_hotels') || '[]');
    const pendingHotels = JSON.parse(localStorage.getItem('kashmirStays_pendingHotels') || '[]');
    
    let migratedCount = 0;
    let errorCount = 0;
    
    // Migrate approved hotels
    for (const hotel of hotels) {
      try {
        const { id, ...hotelData } = hotel;
        await hotelStorage.addHotel({ ...hotelData, status: 'approved' });
        migratedCount++;
        console.log(`✅ Migrated hotel: ${hotel.name}`);
      } catch (error) {
        console.error(`❌ Failed to migrate hotel: ${hotel.name}`, error);
        errorCount++;
      }
    }
    
    // Migrate pending hotels
    for (const hotel of pendingHotels) {
      try {
        const { id, ...hotelData } = hotel;
        await hotelStorage.addHotel({ ...hotelData, status: 'pending' });
        migratedCount++;
        console.log(`✅ Migrated pending hotel: ${hotel.name}`);
      } catch (error) {
        console.error(`❌ Failed to migrate pending hotel: ${hotel.name}`, error);
        errorCount++;
      }
    }
    
    console.log(`\n✅ Migration complete!`);
    console.log(`   Migrated: ${migratedCount} hotels`);
    console.log(`   Errors: ${errorCount}`);
    
    return { success: true, migratedCount, errorCount };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error.message };
  }
};

// Run migration (call this once from browser console)
// window.migrateToFirebase = migrateLocalStorageToFirebase;
