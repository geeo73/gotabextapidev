'use strict';

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  let unregisterHandlerFunctions = [];

  $(document).ready(function () {
      // Add button handlers for clearing filters.
      //$('#resetfilterspng').click(clearAllFilters);
      $('#rfb').click(clearAllFilters);
      $('#rfb').attr('disabled','disabled');
      $("#rfb").attr("src", "../images/resetfiltersd.png" )

      tableau.extensions.initializeAsync().then(function() {
    }, function (err) {
      // Something went wrong in initialization.
      console.log('Error while Initializing: ' + err.toString());
    });
  });

  // This function removes all filters from a dashboard.
  function clearAllFilters () {

    // While performing async task, show loading message to user.
    const dashboard = tableau.extensions.dashboardContent.dashboard;

    dashboard.worksheets.forEach(function (worksheet) {
      worksheet.getFiltersAsync().then(function (filtersForWorksheet) {
        let filterClearPromises = [];

        filtersForWorksheet.forEach(function (filter) {
          filterClearPromises.push(worksheet.clearFilterAsync(filter.fieldName));
        });

        //wait until all promises have finished
        Promise.all(filterClearPromises);
        });
      });
  }
})();
