# Hotel Rate Management System

## Overview

The Hotel Rate Management System provides comprehensive seasonal pricing and blackout date functionality for hotel registrations. This system allows hotels to:

- Set seasonal rates for different periods (Peak, High, Regular, Low seasons)
- Configure weekend pricing premiums
- Block dates for maintenance or private events
- Calculate dynamic rates based on check-in/check-out dates

## Features

### 1. Seasonal Rates
- **Peak Season**: Highest rates during tourist peak times
- **High Season**: Elevated rates during popular periods
- **Regular Season**: Standard rates for normal periods
- **Low Season**: Reduced rates during off-peak times

### 2. Weekend Pricing
- Separate rates for Friday and Saturday nights
- Automatic weekend detection and rate application

### 3. Blackout Dates
- Block specific date ranges for maintenance
- Prevent bookings during private events
- Custom reasons for each blackout period

### 4. Dynamic Rate Calculation
- Real-time rate calculation for any date range
- Considers seasonal rates, weekend premiums, and blackout dates
- Provides detailed breakdown of charges

## Implementation

### Components

#### 1. HotelRateManagement.jsx
Main component for managing rates during hotel registration:
```jsx
import HotelRateManagement from './Components/Hotels/auth/HotelRateManagement';

<HotelRateManagement
  rates={seasonalRates}
  blackoutDates={blackoutDates}
  onRatesChange={setSeasonalRates}
  onBlackoutDatesChange={setBlackoutDates}
/>
```

#### 2. HotelRateDisplay.jsx
Component for displaying calculated rates to customers:
```jsx
import HotelRateDisplay from './Components/Hotels/display/HotelRateDisplay';

<HotelRateDisplay
  hotelRates={hotelRateConfig}
  checkInDate={checkInDate}
  checkOutDate={checkOutDate}
  onRateCalculated={handleRateCalculated}
/>
```

### Utilities

#### 1. hotelRateUtils.js
Core utility functions for rate calculations:

```javascript
import { 
  calculateStayRates, 
  getRateSummary, 
  isBlackoutDate,
  getSeasonalRate 
} from './utils/hotelRateUtils';

// Calculate rates for a stay
const rateCalculation = calculateStayRates(checkIn, checkOut, hotelRates);
const summary = getRateSummary(rateCalculation);
```

### Data Structure

#### Hotel Rate Configuration
```javascript
const hotelRates = {
  defaultRate: 3000,           // Base rate per night
  defaultWeekendRate: 3500,    // Weekend rate per night
  seasonalRates: [
    {
      id: 1,
      season: 'peak',           // peak, high, regular, low
      description: 'Summer Tourist Season',
      startDate: '2024-05-01',
      endDate: '2024-08-31',
      baseRate: 5000,
      weekendRate: 6000
    }
  ],
  blackoutDates: [
    {
      id: 1,
      startDate: '2024-07-15',
      endDate: '2024-07-20',
      reason: 'Annual Maintenance'
    }
  ]
};
```

#### Rate Calculation Result
```javascript
const rateCalculation = {
  nights: 3,
  totalRate: 15000,
  averageRate: 5000,
  available: true,
  dailyRates: [
    {
      date: Date,
      rate: 5000,
      rateType: 'seasonal-peak',
      isWeekend: false,
      available: true,
      seasonalRate: {...},
      blackout: null
    }
  ],
  unavailableDates: []
};
```

## Usage Examples

### 1. Basic Rate Setup
```javascript
// Set default rates
const defaultRate = 2500;
const defaultWeekendRate = 3000;

// Add seasonal rate
const seasonalRate = {
  season: 'peak',
  description: 'Summer Season',
  startDate: '2024-06-01',
  endDate: '2024-08-31',
  baseRate: 4000,
  weekendRate: 5000
};

// Add blackout period
const blackoutPeriod = {
  startDate: '2024-07-15',
  endDate: '2024-07-20',
  reason: 'Hotel Renovation'
};
```

### 2. Rate Calculation
```javascript
import { calculateStayRates, getRateSummary } from './utils/hotelRateUtils';

const checkIn = new Date('2024-07-10');
const checkOut = new Date('2024-07-13');

const calculation = calculateStayRates(checkIn, checkOut, hotelRates);
const summary = getRateSummary(calculation);

console.log(`Total cost: ₹${summary.totalRate}`);
console.log(`Average per night: ₹${summary.averageRate}`);
console.log(`Available: ${summary.available}`);
```

### 3. Validation
```javascript
import { validateRateConfig } from './utils/hotelRateUtils';

const validation = validateRateConfig(hotelRates);

if (!validation.valid) {
  console.log('Errors:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.log('Warnings:', validation.warnings);
}
```

## Integration with Hotel Registration

The rate management system is integrated into the hotel registration process as Step 3:

1. **Personal Information** - Owner details
2. **Hotel Information** - Hotel details and location
3. **Rate Management** - Seasonal rates and blackout dates ⭐ NEW
4. **Legal Documents** - GST and PAN information

### Updated Registration Form

The `HotelRegistrationForm.jsx` now includes:
- Default rate input fields
- Weekend rate configuration
- Seasonal rate management interface
- Blackout date management
- Rate validation

### Database Storage

Rate information is stored in Firestore with the hotel registration:

```javascript
const hotelRegistrationDoc = {
  // ... existing fields
  defaultRate: 3000,
  defaultWeekendRate: 3500,
  seasonalRates: [...],
  blackoutDates: [...],
  // ... other fields
};
```

## Demo

Visit `/hotel-rates-demo` to see the rate management system in action with sample hotels and different rate configurations.

## Rate Types

### Season Classifications
- **Peak Season** (Red): Highest demand periods (e.g., summer in Kashmir)
- **High Season** (Orange): Popular travel times (e.g., spring/autumn)
- **Regular Season** (Blue): Normal demand periods
- **Low Season** (Green): Off-peak times with lower rates

### Rate Calculation Priority
1. Check for blackout dates (blocks booking)
2. Check for applicable seasonal rates
3. Apply weekend premium if applicable
4. Fall back to default rates

## Best Practices

### Rate Setting
- Peak season rates: 50-100% higher than default
- Weekend rates: 20-30% higher than weekday rates
- Ensure seasonal periods don't overlap
- Set competitive rates based on local market

### Blackout Management
- Use for planned maintenance periods
- Block dates for private events or weddings
- Provide clear reasons for blackout periods
- Plan blackouts during low-demand periods when possible

### Validation
- Always validate rate configurations before saving
- Check for overlapping seasonal periods
- Ensure start dates are before end dates
- Verify rates are positive numbers

## Technical Notes

### Performance
- Rate calculations are performed client-side for instant feedback
- Firestore queries are optimized for rate data retrieval
- Components use React.memo for performance optimization

### Accessibility
- All form inputs have proper labels
- Color coding includes text labels for accessibility
- Keyboard navigation supported throughout

### Browser Support
- Modern browsers with ES6+ support
- Date input fields work across all major browsers
- Responsive design for mobile and desktop

## Future Enhancements

- **Dynamic Pricing**: AI-based rate suggestions
- **Competitor Analysis**: Market rate comparison
- **Booking Analytics**: Rate performance tracking
- **Bulk Operations**: Import/export rate configurations
- **Advanced Rules**: Complex pricing logic (e.g., length of stay discounts)

## Support

For questions or issues with the rate management system:
1. Check the validation messages for configuration errors
2. Review the console logs for calculation details
3. Test with the demo page at `/hotel-rates-demo`
4. Refer to the utility functions documentation in `hotelRateUtils.js`