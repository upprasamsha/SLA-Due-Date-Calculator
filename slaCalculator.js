document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('slaCalculatorForm').addEventListener('submit', function(event) {
      event.preventDefault();
  
      const startOfBusiness = document.getElementById('businessStart').value;
      const endOfBusiness = document.getElementById('businessEnd').value;
      const responseTimeHours = parseInt(document.getElementById('responseTime').value, 10);
      const ticketCreationDateTime = new Date(document.getElementById('ticketCreation').value);
  
      // Calculate the due date
      const dueDate = calculateDueDate(ticketCreationDateTime, responseTimeHours, startOfBusiness, endOfBusiness);
      
      // Display the result
      document.getElementById('result').textContent = `The due date for the ticket is: ${dueDate.toLocaleString()}`;
    });
  });
  
  function calculateDueDate(creationDateTime, responseHours, startBusiness, endBusiness) {
    // Convert business hours to date objects
    const startBusinessDateTime = new Date(creationDateTime);
    startBusinessDateTime.setHours(...startBusiness.split(':').map(Number), 0, 0);
    const endBusinessDateTime = new Date(creationDateTime);
    endBusinessDateTime.setHours(...endBusiness.split(':').map(Number), 0, 0);
  
    // Calculate the due date based on business hours
    let dueDateTime = new Date(creationDateTime);
    while (responseHours > 0) {
      let isWeekend = dueDateTime.getDay() === 0 || dueDateTime.getDay() === 6;
      let isBeforeHours = dueDateTime < startBusinessDateTime;
      let isAfterHours = dueDateTime >= endBusinessDateTime;
  
      if (isWeekend) {
        dueDateTime.setDate(dueDateTime.getDate() + (dueDateTime.getDay() === 0 ? 1 : 2));
        dueDateTime.setHours(...startBusiness.split(':').map(Number), 0, 0);
      } else if (isBeforeHours) {
        dueDateTime.setHours(...startBusiness.split(':').map(Number), 0, 0);
      } else if (isAfterHours) {
        dueDateTime.setDate(dueDateTime.getDate() + 1);
        dueDateTime.setHours(...startBusiness.split(':').map(Number), 0, 0);
      } else {
        const timeLeftInBusinessDay = (endBusinessDateTime - dueDateTime) / 36e5;
        const timeToDeduct = Math.min(responseHours, timeLeftInBusinessDay);
        dueDateTime.setHours(dueDateTime.getHours() + timeToDeduct);
        responseHours -= timeToDeduct;
      }
  
      // Update business day boundaries for the next loop iteration
      startBusinessDateTime.setDate(dueDateTime.getDate());
      endBusinessDateTime.setDate(dueDateTime.getDate());
      startBusinessDateTime.setHours(...startBusiness.split(':').map(Number), 0, 0);
      endBusinessDateTime.setHours(...endBusiness.split(':').map(Number), 0, 0);
    }
  
    return dueDateTime;
  }
  