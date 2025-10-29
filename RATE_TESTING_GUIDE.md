# Hotel Rate Management Testing Guide

## How to Test the Rate Management System

### 1. Test the Rate Management Component
Visit: `http://localhost:3000/rate-test`

This page allows you to:
- Add seasonal rates
- Add blackout dates
- See the data being stored in real-time

### 2. Test Hotel Registration with Rates

1. **Go to Hotel Registration**: Visit `/hotels-register`
2. **Complete Steps 1-2**: Fill in personal and hotel information
3. **Step 3 - Rate Management**:
   - Set default rate (e.g., 3000)
   - Set weekend rate (e.g., 3500)
   - **Add a Seasonal Rate**:
     - Season: Peak
     - Description: Summer Season
     - Start Date: 2024-06-01
     - End Date: 2024-08-31
     - Base Rate: 5000
     - Weekend Rate: 6000
   - **Add a Blackout Date**:
     - Start Date: 2024-07-15
     - End Date: 2024-07-20
     - Reason: Annual Maintenance
4. **Complete Step 4**: Fill in GST and PAN details
5. **Submit**: Check console logs for saved data

### 3. View Saved Data
Visit: `http://localhost:3000/hotel-data`

This page shows all registered hotels with their rate information.

### 4. Test Rate Calculation
Visit: `http://localhost:3000/hotel-rates-demo`

This page demonstrates how rates are calculated based on:
- Check-in and check-out dates
- Seasonal rates
- Weekend premiums
- Blackout dates

## Expected Output in Registration

When you register a hotel with rates, you should see in the console:

```javascript
Complete form data being sent: {
  seasonalRates: [
    {
      id: 1234567890,
      season: 'peak',
      description: 'Summer Season',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      baseRate: 5000,
      weekendRate: 6000
    }
  ],
  blackoutDates: [
    {
      id: 1234567891,
      startDate: '2024-07-15',
      endDate: '2024-07-20',
      reason: 'Annual Maintenance'
    }
  ],
  defaultRate: '3000',
  defaultWeekendRate: '3500'
}
```

## Troubleshooting

### If you don't see seasonal rates/blackout dates:

1. **Check Console Logs**: Look for the debug messages during registration
2. **Verify Data Entry**: Make sure you actually added rates in Step 3
3. **Check Firestore**: Use the `/hotel-data` page to see what was saved
4. **Test Component**: Use `/rate-test` to verify the component works

### Common Issues:

1. **Empty Arrays**: If you don't add any seasonal rates or blackout dates, the arrays will be empty `[]`
2. **Missing Data**: Make sure to click "Add Rate" and "Add Blackout Period" buttons
3. **Validation**: Ensure all required fields are filled before adding rates

## Sample Test Data

### Seasonal Rate Example:
- Season: Peak
- Description: Tourist Season
- Start Date: 2024-05-01
- End Date: 2024-09-30
- Base Rate: 4000
- Weekend Rate: 5000

### Blackout Date Example:
- Start Date: 2024-12-24
- End Date: 2024-12-26
- Reason: Holiday Closure

## Verification Steps

1. ✅ Add seasonal rates in Step 3
2. ✅ Add blackout dates in Step 3
3. ✅ Check review section shows correct counts
4. ✅ Submit registration
5. ✅ Check console logs for data
6. ✅ Visit `/hotel-data` to see saved information
7. ✅ Test rate calculation on demo page