'use strict';

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  // Use the jQuery document ready signal to know when everything has been initialized
  $(document).ready(function () {
    // Tell Tableau we'd like to initialize our extension
    tableau.extensions.initializeAsync().then(function () {
      // Once the extension is initialized, ask the user to choose a sheet
      showSheetNames();
    });
  });

    /**
   * Shows the choose sheet UI. Once a sheet is selected, the data table for the sheet is shown
   */
  function showSheetNames() {
    
    // Set the dashboard's name in the title
    const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
    $('#dashboard_name').text(dashboardName);
    alert('here');

    // The first step in choosing a sheet will be asking Tableau what sheets are available
    const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    // Next, we loop through all of these worksheets and pop an alert with it's name
    worksheets.forEach(function (worksheet) {
      // For now, just pop up an alert saying that we've selected a sheet
      var wsname = worksheet.name;
      alert('and here');
      //alert(`Sheet name - ${wsname}`);

      $('body').append('<p>Sheet - ' + ${wsname} + '</p>')
    });
  }

})();